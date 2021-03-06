package main

import (
	"bytes"
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"time"

	"github.com/gorilla/websocket"
)

func getRequest(url string) string {
	for n := 0; n <= 30; n++ {
		resp, err := http.Get(url)
		if err != nil {
			log.Println(err)
			log.Println("In einer Sekunde erneut versuchen...")
			time.Sleep(time.Second)
			continue
		}
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Println(err)
			log.Println("In einer Sekunde erneut versuchen...")
			time.Sleep(time.Second)
			continue
		}
		responseBody := string(body)
		return responseBody
	}
	log.Fatalln("Zu viele Fehlversuche!")
	panic("Zu viele Fehlversuche!")
}

func Send(c *websocket.Conn, msg []byte) {
	time.Sleep(1 * time.Second)
	errWrite := c.WriteMessage(websocket.TextMessage, msg)
	if errWrite != nil {
		log.Fatal("Write:", errWrite)
		return
	}
}

func getResult(channel chan []byte) []byte {
	select {
	case res := <-channel:
		return res
	case <-time.After(1 * time.Second):
		log.Fatalln("Channel timed out!")
		return []byte{}
	}
}

func testServer(serverAddress string) {
	var addr = flag.String("addr", serverAddress, "Server")

	recvMsg1 := make(chan []byte, 10)
	recvMsg2 := make(chan []byte, 10)

	u := url.URL{Scheme: "ws", Host: *addr, Path: ""}
	log.Printf("Verbinden mit: %s", u.String())

	c1, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("Dial:", err)
	}
	defer c1.Close()

	c2, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("Dial:", err)
	}
	defer c2.Close()

	go func() {
		for {
			_, message, err := c1.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			log.Printf("recv: %s", message)
			recvMsg1 <- message[:len(message)-1]
		}
	}()

	go func() {
		for {
			_, message, err := c2.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			log.Printf("recv: %s", message)
			recvMsg2 <- message[:len(message)-1]
		}
	}()

	// Addition Initialization
	Send(c1, []byte(`{"socketProtocol":"initialization","data":"{\"computation_id\":\"testSum\",\"party_count\":2,\"public_key\":\"\"}"}`))
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"initialization","data":"{\"party_id\":1,\"party_count\":2,\"public_keys\":{\"1\":\"\",\"s1\":\"\"}}"}`)) {
		log.Fatalln("Unerwartete Antwort auf initialization von Partei 1")
	}

	Send(c2, []byte(`{"socketProtocol":"initialization","data":"{\"computation_id\":\"testSum\",\"party_count\":2,\"public_key\":\"\"}"}`))
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"public_keys","data":"{\"public_keys\":{\"1\":\"\",\"2\":\"\",\"s1\":\"\"}}"}`)) {
		log.Fatalln("Unerwartete Antwort auf initialization von Partei 2")
	}
	if !bytes.Equal(getResult(recvMsg2), []byte(`{"socketProtocol":"initialization","data":"{\"party_id\":2,\"party_count\":2,\"public_keys\":{\"1\":\"\",\"2\":\"\",\"s1\":\"\"}}"}`)) {
		log.Fatalln("Unerwartete Antwort auf initialization von Partei 2")
	}

	// Addition Share
	Send(c1, []byte(`{"socketProtocol":"share","data":"{\"party_id\":2,\"share\":\"1812732\",\"op_id\":\"share:1,2:1,2:0\"}"}`))
	if !bytes.Equal(getResult(recvMsg2), []byte(`{"socketProtocol":"share","data":"{\"party_id\":1,\"share\":\"1812732\",\"op_id\":\"share:1,2:1,2:0\"}"}`)) {
		log.Fatalln("Unerwartete Antwort auf share von Partei 1")
	}

	Send(c2, []byte(`{"socketProtocol":"share","data":"{\"party_id\":1,\"share\":\"11789708\",\"op_id\":\"share:1,2:1,2:0\"}"}`))
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"share","data":"{\"party_id\":2,\"share\":\"11789708\",\"op_id\":\"share:1,2:1,2:0\"}"}`)) {
		log.Fatalln("Unerwartete Antwort auf share von Partei 2")
	}

	Send(c1, []byte(`{"socketProtocol":"crypto_provider","data":"{\"label\":\"numbers\",\"op_id\":\"open:1,2:1,2:0:refresh\",\"receivers\":[1,2],\"threshold\":2,\"Zp\":16777729,\"params\":{\"number\":0,\"count\":1}}"}`))
	Send(c2, []byte(`{"socketProtocol":"crypto_provider","data":"{\"label\":\"numbers\",\"op_id\":\"open:1,2:1,2:0:refresh\",\"receivers\":[1,2],\"threshold\":2,\"Zp\":16777729,\"params\":{\"number\":0,\"count\":1}}"}`))

	// Addition Open
	Send(c2, []byte(`{"socketProtocol":"open","data":"{\"party_id\":1,\"share\":\"10041622\",\"op_id\":\"open:1,2:1,2:0\",\"Zp\":16777729}"}`))
	crypto_provider_sum_open_party_1_match, crypto_provider_sum_open_party_1_err := regexp.MatchString(`{\"socketProtocol\":\"crypto_provider\",\"data\":\"{\\"op_id\\":\\"open:1,2:1,2:0:refresh\\",\\"receivers\\":\[1,2\],\\"threshold\\":2,\\"Zp\\":16777729,\\"shares\\":\[[0-9]*\]}\"}`, string(getResult(recvMsg1)))
	if crypto_provider_sum_open_party_1_err != nil {
		log.Fatalln("Fehler beim Auswerten von Antwort auf crypto_provider open von Partei 1")
	}
	if !crypto_provider_sum_open_party_1_match {
		log.Fatalln("Unerwartete Antwort auf crypto_provider open von Partei 1")
	}
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"open","data":"{\"party_id\":2,\"share\":\"10041622\",\"op_id\":\"open:1,2:1,2:0\",\"Zp\":16777729}"}`)) {
		log.Fatalln("Unerwartete Antwort auf open von Partei 2")
	}

	Send(c1, []byte(`{"socketProtocol":"open","data":"{\"party_id\":2,\"share\":\"5020826\",\"op_id\":\"open:1,2:1,2:0\",\"Zp\":16777729}"}`))
	crypto_provider_party_2_match, crypto_provider_party_2_err := regexp.MatchString(`{\"socketProtocol\":\"crypto_provider\",\"data\":\"{\\"op_id\\":\\"open:1,2:1,2:0:refresh\\",\\"receivers\\":\[1,2\],\\"threshold\\":2,\\"Zp\\":16777729,\\"shares\\":\[[0-9]*\]}\"}`, string(getResult(recvMsg2)))
	if crypto_provider_party_2_err != nil {
		log.Fatalln("Fehler beim Auswerten von Antwort auf crypto_provider von Partei 2")
	}
	if !crypto_provider_party_2_match {
		log.Fatalln("Unerwartete Antwort auf crypto_provider von Partei 2")
	}
	if !bytes.Equal(getResult(recvMsg2), []byte(`{"socketProtocol":"open","data":"{\"party_id\":1,\"share\":\"5020826\",\"op_id\":\"open:1,2:1,2:0\",\"Zp\":16777729}"}`)) {
		log.Fatalln("Unerwartete Antwort auf open von Partei 1")
	}

	// Preprocessing
	Send(c1, []byte(`{"socketProtocol":"share","data":"{\"party_id\":2,\"share\":\"1585433\",\"op_id\":\"preprocessing:open:1,2:1,2:0:refresh:1,2:share\"}"}`))
	if !bytes.Equal(getResult(recvMsg2), []byte(`{"socketProtocol":"share","data":"{\"party_id\":1,\"share\":\"1585433\",\"op_id\":\"preprocessing:open:1,2:1,2:0:refresh:1,2:share\"}"}`)) {
		log.Fatalln("Unerwartete Antwort auf preprocessing share von Partei 1")
	}

	Send(c2, []byte(`{"socketProtocol":"share","data":"{\"party_id\":1,\"share\":\"16698624\",\"op_id\":\"preprocessing:open:1,2:1,2:0:refresh:1,2:share\"}"}`))
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"share","data":"{\"party_id\":2,\"share\":\"16698624\",\"op_id\":\"preprocessing:open:1,2:1,2:0:refresh:1,2:share\"}"}`)) {
		log.Fatalln("Unerwartete Antwort auf preprocessing share von Partei 2")
	}

	// Multiplikation Initialization
	Send(c1, []byte(`{"socketProtocol":"initialization","data":"{\"computation_id\":\"testMulti\",\"party_count\":2,\"public_key\":\"\"}"}`))
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"initialization","data":"{\"party_id\":1,\"party_count\":2,\"public_keys\":{\"1\":\"\",\"s1\":\"\"}}"}`)) {
		log.Fatalln("Unerwartete Antwort auf initialization von Partei 1")
	}

	Send(c2, []byte(`{"socketProtocol":"initialization","data":"{\"computation_id\":\"testMulti\",\"party_count\":2,\"public_key\":\"\"}"}`))
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"public_keys","data":"{\"public_keys\":{\"1\":\"\",\"2\":\"\",\"s1\":\"\"}}"}`)) {
		log.Fatalln("Unerwartete Antwort auf initialization von Partei 2")
	}
	if !bytes.Equal(getResult(recvMsg2), []byte(`{"socketProtocol":"initialization","data":"{\"party_id\":2,\"party_count\":2,\"public_keys\":{\"1\":\"\",\"2\":\"\",\"s1\":\"\"}}"}`)) {
		log.Fatalln("Unerwartete Antwort auf initialization von Partei 2")
	}

	// Multiplikation Share
	Send(c1, []byte(`{"socketProtocol":"share","data":"{\"party_id\":2,\"share\":\"10368445\",\"op_id\":\"share:1,2:1,2:0\"}"}`))
	if !bytes.Equal(getResult(recvMsg2), []byte(`{"socketProtocol":"share","data":"{\"party_id\":1,\"share\":\"10368445\",\"op_id\":\"share:1,2:1,2:0\"}"}`)) {
		log.Fatalln("Unerwartete Antwort auf share von Partei 1")
	}

	Send(c1, []byte(`{"socketProtocol":"crypto_provider","data":"{\"label\":\"triplet\",\"op_id\":\"smult:1,2:0:triplet\",\"receivers\":[1,2],\"threshold\":2,\"Zp\":16777729,\"params\":{}}"}`))
	crypto_provider_multi_beaver_party_1_match, crypto_provider_multi_beaver_party_1_err := regexp.MatchString(`{\"socketProtocol\":\"crypto_provider\",\"data\":\"{\\\"op_id\\\":\\\"smult:1,2:0:triplet\\\",\\\"receivers\\\":\[1,2\],\\\"threshold\\\":2,\\\"Zp\\\":16777729,\\\"shares\\\":\[[0-9]*,[0-9]*,[0-9]*\]}\"}`, string(getResult(recvMsg1)))
	if crypto_provider_multi_beaver_party_1_err != nil {
		log.Fatalln("Fehler beim Auswerten von Antwort auf Beaver Triple von Partei 1")
	}
	if !crypto_provider_multi_beaver_party_1_match {
		log.Fatalln("Unerwartete Antwort auf Beaver Triple: Kein regex match von Partei 1")
	}

	Send(c1, []byte(`{"socketProtocol":"crypto_provider","data":"{\"label\":\"numbers\",\"op_id\":\"open:1,2:1,2:0:refresh\",\"receivers\":[1,2],\"threshold\":2,\"Zp\":16777729,\"params\":{\"number\":0,\"count\":1}}"}`))
	crypto_provider_multi_open_party_1_match, crypto_provider_multi_open_party_1_err := regexp.MatchString(`{\"socketProtocol\":\"crypto_provider\",\"data\":\"{\\"op_id\\":\\"open:1,2:1,2:0:refresh\\",\\"receivers\\":\[1,2\],\\"threshold\\":2,\\"Zp\\":16777729,\\"shares\\":\[[0-9]*\]}\"}`, string(getResult(recvMsg1)))
	if crypto_provider_multi_open_party_1_err != nil {
		log.Fatalln("Fehler beim Auswerten von Antwort auf crypto_provider open von Partei 1")
	}
	if !crypto_provider_multi_open_party_1_match {
		log.Fatalln("Unerwartete Antwort auf crypto_provider open von Partei 1")
	}

	Send(c1, []byte(`{"socketProtocol":"crypto_provider","data":"{\"label\":\"numbers\",\"op_id\":\"smult:1,2:0:open1:refresh\",\"receivers\":[1,2],\"threshold\":2,\"Zp\":16777729,\"params\":{\"number\":0,\"count\":1}}"}`))
	crypto_provider_multi_smul_open1_party_1_match, crypto_provider_multi_smul_open1_party_1_err := regexp.MatchString(`{\"socketProtocol\":\"crypto_provider\",\"data\":\"{\\"op_id\\":\\"smult:1,2:0:open1:refresh\\",\\"receivers\\":\[1,2\],\\"threshold\\":2,\\"Zp\\":16777729,\\"shares\\":\[[0-9]*\]}\"}`, string(getResult(recvMsg1)))
	if crypto_provider_multi_smul_open1_party_1_err != nil {
		log.Fatalln("Fehler beim Auswerten von Antwort auf crypto_provider smul open1 von Partei 1")
	}
	if !crypto_provider_multi_smul_open1_party_1_match {
		log.Fatalln("Unerwartete Antwort auf crypto_provider smul open1 von Partei 1")
	}

	Send(c1, []byte(`{"socketProtocol":"crypto_provider","data":"{\"label\":\"numbers\",\"op_id\":\"smult:1,2:0:open2:refresh\",\"receivers\":[1,2],\"threshold\":2,\"Zp\":16777729,\"params\":{\"number\":0,\"count\":1}}"}`))
	crypto_provider_multi_smul_open2_party_1_match, crypto_provider_multi_smul_open2_party_1_err := regexp.MatchString(`{\"socketProtocol\":\"crypto_provider\",\"data\":\"{\\"op_id\\":\\"smult:1,2:0:open2:refresh\\",\\"receivers\\":\[1,2\],\\"threshold\\":2,\\"Zp\\":16777729,\\"shares\\":\[[0-9]*\]}\"}`, string(getResult(recvMsg1)))
	if crypto_provider_multi_smul_open2_party_1_err != nil {
		log.Fatalln("Fehler beim Auswerten von Antwort auf crypto_provider smul open2 von Partei 1")
	}
	if !crypto_provider_multi_smul_open2_party_1_match {
		log.Fatalln("Unerwartete Antwort auf crypto_provider smul open2 von Partei 1")
	}

	Send(c1, []byte(`{"socketProtocol":"open","data":"{\"party_id\":2,\"share\":\"10064751\",\"op_id\":\"smult:1,2:0:open2\",\"Zp\":16777729}"}`))
	if !bytes.Equal(getResult(recvMsg2), []byte(`{"socketProtocol":"open","data":"{\"party_id\":1,\"share\":\"10064751\",\"op_id\":\"smult:1,2:0:open2\",\"Zp\":16777729}"}`)) {
		log.Fatalln("Unerwartete Antwort auf share von Partei 1")
	}

	Send(c2, []byte(`{"socketProtocol":"share","data":"{\"party_id\":1,\"share\":\"8911686\",\"op_id\":\"share:1,2:1,2:0\"}"}`))
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"share","data":"{\"party_id\":2,\"share\":\"8911686\",\"op_id\":\"share:1,2:1,2:0\"}"}`)) {
		log.Fatalln("Unerwartete Antwort auf share von Partei 2")
	}

	Send(c2, []byte(`{"socketProtocol":"crypto_provider","data":"{\"label\":\"triplet\",\"op_id\":\"smult:1,2:0:triplet\",\"receivers\":[1,2],\"threshold\":2,\"Zp\":16777729,\"params\":{}}"}`))
	crypto_provider_multi_beaver_party_2_match, crypto_provider_multi_beaver_party_2_err := regexp.MatchString(`{\"socketProtocol\":\"crypto_provider\",\"data\":\"{\\\"op_id\\\":\\\"smult:1,2:0:triplet\\\",\\\"receivers\\\":\[1,2\],\\\"threshold\\\":2,\\\"Zp\\\":16777729,\\\"shares\\\":\[[0-9]*,[0-9]*,[0-9]*\]}\"}`, string(getResult(recvMsg2)))
	if crypto_provider_multi_beaver_party_2_err != nil {
		log.Fatalln("Fehler beim Auswerten von Antwort auf Beaver Triple von Partei 2")
	}
	if !crypto_provider_multi_beaver_party_2_match {
		log.Fatalln("Unerwartete Antwort auf Beaver Triple: Kein regex match von Partei 2")
	}

	Send(c2, []byte(`{"socketProtocol":"crypto_provider","data":"{\"label\":\"numbers\",\"op_id\":\"open:1,2:1,2:0:refresh\",\"receivers\":[1,2],\"threshold\":2,\"Zp\":16777729,\"params\":{\"number\":0,\"count\":1}}"}`))
	crypto_provider_multi_open_party_2_match, crypto_provider_multi_open_party_2_err := regexp.MatchString(`{\"socketProtocol\":\"crypto_provider\",\"data\":\"{\\"op_id\\":\\"open:1,2:1,2:0:refresh\\",\\"receivers\\":\[1,2\],\\"threshold\\":2,\\"Zp\\":16777729,\\"shares\\":\[[0-9]*\]}\"}`, string(getResult(recvMsg2)))
	if crypto_provider_multi_open_party_2_err != nil {
		log.Fatalln("Fehler beim Auswerten von Antwort auf crypto_provider open von Partei 2")
	}
	if !crypto_provider_multi_open_party_2_match {
		log.Fatalln("Unerwartete Antwort auf crypto_provider open von Partei 2")
	}

	Send(c2, []byte(`{"socketProtocol":"crypto_provider","data":"{\"label\":\"numbers\",\"op_id\":\"smult:1,2:0:open1:refresh\",\"receivers\":[1,2],\"threshold\":2,\"Zp\":16777729,\"params\":{\"number\":0,\"count\":1}}"}`))
	crypto_provider_multi_smul_open1_party_2_match, crypto_provider_multi_smul_open1_party_2_err := regexp.MatchString(`{\"socketProtocol\":\"crypto_provider\",\"data\":\"{\\"op_id\\":\\"smult:1,2:0:open1:refresh\\",\\"receivers\\":\[1,2\],\\"threshold\\":2,\\"Zp\\":16777729,\\"shares\\":\[[0-9]*\]}\"}`, string(getResult(recvMsg2)))
	if crypto_provider_multi_smul_open1_party_2_err != nil {
		log.Fatalln("Fehler beim Auswerten von Antwort auf crypto_provider smul open2 von Partei 2")
	}
	if !crypto_provider_multi_smul_open1_party_2_match {
		log.Fatalln("Unerwartete Antwort auf crypto_provider smul open2 von Partei 2")
	}

	Send(c2, []byte(`{"socketProtocol":"crypto_provider","data":"{\"label\":\"numbers\",\"op_id\":\"smult:1,2:0:open2:refresh\",\"receivers\":[1,2],\"threshold\":2,\"Zp\":16777729,\"params\":{\"number\":0,\"count\":1}}"}`))
	crypto_provider_multi_smul_open2_party_2_match, crypto_provider_multi_smul_open2_party_2_err := regexp.MatchString(`{\"socketProtocol\":\"crypto_provider\",\"data\":\"{\\"op_id\\":\\"smult:1,2:0:open2:refresh\\",\\"receivers\\":\[1,2\],\\"threshold\\":2,\\"Zp\\":16777729,\\"shares\\":\[[0-9]*\]}\"}`, string(getResult(recvMsg2)))
	if crypto_provider_multi_smul_open2_party_2_err != nil {
		log.Fatalln("Fehler beim Auswerten von Antwort auf crypto_provider smul open2 von Partei 1")
	}
	if !crypto_provider_multi_smul_open2_party_2_match {
		log.Fatalln("Unerwartete Antwort auf crypto_provider smul open2 von Partei 1")
	}

	// Multiplikation Open
	Send(c1, []byte(`{"socketProtocol":"open","data":"{\"party_id\":2,\"share\":\"11948399\",\"op_id\":\"smult:1,2:0:open1\",\"Zp\":16777729}"}`))
	if !bytes.Equal(getResult(recvMsg2), []byte(`{"socketProtocol":"open","data":"{\"party_id\":1,\"share\":\"11948399\",\"op_id\":\"smult:1,2:0:open1\",\"Zp\":16777729}"}`)) {
		log.Fatalln("Unerwartete Antwort auf open1 von Partei 1")
	}

	Send(c2, []byte(`{"socketProtocol":"open","data":"{\"party_id\":1,\"share\":\"14856059\",\"op_id\":\"smult:1,2:0:open1\",\"Zp\":16777729}"}`))
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"open","data":"{\"party_id\":2,\"share\":\"14856059\",\"op_id\":\"smult:1,2:0:open1\",\"Zp\":16777729}"}`)) {
		log.Fatalln("Unerwartete Antwort auf open1 von Partei 2")
	}

	Send(c2, []byte(`{"socketProtocol":"open","data":"{\"party_id\":1,\"share\":\"7346088\",\"op_id\":\"smult:1,2:0:open2\",\"Zp\":16777729}"}`))
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"open","data":"{\"party_id\":2,\"share\":\"7346088\",\"op_id\":\"smult:1,2:0:open2\",\"Zp\":16777729}"}`)) {
		log.Fatalln("Unerwartete Antwort auf open1 von Partei 2")
	}

	Send(c2, []byte(`{"socketProtocol":"open","data":"{\"party_id\":1,\"share\":\"5949768\",\"op_id\":\"open:1,2:1,2:0\",\"Zp\":16777729}"}`))
	if !bytes.Equal(getResult(recvMsg1), []byte(`{"socketProtocol":"open","data":"{\"party_id\":2,\"share\":\"5949768\",\"op_id\":\"open:1,2:1,2:0\",\"Zp\":16777729}"}`)) {
		log.Fatalln("Unerwartete Antwort auf open1 von Partei 2")
	}

	Send(c1, []byte(`{"socketProtocol":"open","data":"{\"party_id\":2,\"share\":\"11363756\",\"op_id\":\"open:1,2:1,2:0\",\"Zp\":16777729}"}`))
	if !bytes.Equal(getResult(recvMsg2), []byte(`{"socketProtocol":"open","data":"{\"party_id\":1,\"share\":\"11363756\",\"op_id\":\"open:1,2:1,2:0\",\"Zp\":16777729}"}`)) {
		log.Fatalln("Unerwartete Antwort auf open1 von Partei 1")
	}

	log.Println("Test erfolgreich!")

}
func main() {

	// Standartwerte k??nnen mit Command Line Arguments ??berschreiben werden
	// Beispiel: go run . 127.0.0.1:5500 127.0.0.1:8080
	clientAddress := "client.mpc.nico.re:8080"
	serverAddress := "server.mpc.nico.re:8080"

	args := os.Args[1:]
	if len(args) >= 2 {
		clientAddress = args[0]
		serverAddress = args[1]
	}

	log.Println(getRequest("http://" + clientAddress))
	log.Println(getRequest("http://" + serverAddress + "/test"))

	testServer(serverAddress)
}
