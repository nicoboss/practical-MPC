//Golang code lose basierend auf JIFF Server JavaScript Code

package main

import (
	"crypto/rand"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/keygen"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/structs"
	"PracticalMPC/Server/types"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{}
var computationMaps = structs.NewComputationMaps()
var socketMaps = structs.NewSocketMaps()
var cryptoMap = make(map[string]map[string]map[string]structs.InnerCryptoMap) // { computation_id -> { op_id -> { party_id -> { 'shares': [ numeric shares for this party ], 'values': <any non-secret value(s) for this party> } } } }
var party_id_counter int = 1

func assertAvailablePRNG() {
	buf := make([]byte, 1)
	_, err := io.ReadFull(rand.Reader, buf)
	if err != nil {
		panic(fmt.Sprintf("Kein kryptographisch sicheren Zufallsgenerator vorhanden: crypto/rand: Read() failed with %#v", err))
	}
}

func initComputation(computation_id string, party_id string, party_count int) {
	if computationMaps.ClientIds[computation_id] == nil {
		computationMaps.ClientIds[computation_id] = make([]string, party_count)
		computationMaps.MaxCount[computation_id] = party_count
		computationMaps.FreeParties[computation_id] = make(map[string]bool)
		computationMaps.Keys[computation_id] = make(map[string]types.JSON_key)
		socketMaps.SocketId[computation_id] = make(map[string]*websocket.Conn)
		mailbox.Init(computation_id)
		cryptoMap[computation_id] = make(map[string]map[string]structs.InnerCryptoMap)
	}

	if !(types.Contains(computationMaps.ClientIds[computation_id], party_id)) {
		computationMaps.ClientIds[computation_id] = append(computationMaps.ClientIds[computation_id], party_id)
	}
}

// Initialisierung einer Partei. Rückgabe: Initialisierungsnachricht mit der Partei-ID oder eine Fehlermeldung
func initializeParty(computation_id string, party_id string, public_key types.JSON_key, party_count int, _s1 bool) (bool, *structs.InitializePartyMsg) {

	log.Println("Server inizialisiert mit ", computation_id, "-", party_id, " #", party_count, "::", _s1)

	if !_s1 && party_id == "s1" {
		log.Fatal("party_id s1 ist für den Server reserviert und darf nicht von einem Client verwendet werden!")
	}

	// Liste aller noch verfügbaren Partei erstellen
	if computationMaps.SpareIds[computation_id] == nil {
		computationMaps.SpareIds[computation_id] = make([]bool, party_count)
	}

	if party_id != "" {
		if party_id != "s1" && computationMaps.SpareIds[computation_id][conversions.GetPartyIdInt(party_id)-1] {
			log.Fatal("party_id existiert schon")
		}
	} else { // generate einer freien party_id
		var currentSpareIds = computationMaps.SpareIds[computation_id]
		for i := range currentSpareIds {
			if !currentSpareIds[i] {
				party_id = fmt.Sprint(i)
				break
			}
		}
	}

	if party_id != "s1" {
		computationMaps.SpareIds[computation_id][conversions.GetPartyIdInt(party_id)-1] = true
	}

	// Initialisierung der Berechnung und definieren aller noch undefinierten Objekten.
	initComputation(computation_id, party_id, party_count)

	// Initialisierungsnachricht für den Client erstellen
	keymap_to_send := keygen.StoreAndSendPublicKey(computationMaps, computation_id, party_id, public_key)

	var message = structs.NewInitializePartyMsg(party_id, party_count, keymap_to_send)
	return true, message
}

func initialization(data string, party_id string, socket *websocket.Conn) {

	var inputData = &structs.InputMessageDataInitialization{}
	conversions.ToObj([]byte(data), inputData)
	success, message := initializeParty(inputData.Computation_id, party_id, inputData.Public_key, inputData.Party_count, false)

	if socketMaps.SocketId[inputData.Computation_id] == nil {
		socketMaps.SocketId[inputData.Computation_id] = make(map[string]*websocket.Conn)
	}

	mailbox.SendMails(socketMaps, inputData.Computation_id)

	if success {
		socketMaps.SocketId[inputData.Computation_id][message.Party_id] = socket
		socketMaps.ComputationId[socket] = inputData.Computation_id
		socketMaps.PartyId[socket] = message.Party_id
		outputMessageObj := &structs.OutputMessage{
			SocketProtocol: "initialization",
			Data:           conversions.ToJSON(message),
		}
		socket.WriteJSON(outputMessageObj)
		log.Printf("Sent: %s", conversions.ToJSON(outputMessageObj))

		// Now that party is connected and has the needed public keys,
		// send the mailbox with pending messages to the party.
		// jiff.resend_mailbox(computation_id, party_id)
	} else {
		// Change error to its own protocol type since ws does not support error messages natively
		/* Messages sent over socket.io are now under the label 'data' while previously used protocols are sent under 'socketProtocol' */
		innerOutputMessageErrorObj := &structs.InnerOutputMessageError{ErrorProtocol: "initialization", Error: conversions.ToJSON(message)}
		outputMessageObj := &structs.OutputMessage{SocketProtocol: "error", Data: conversions.ToJSON(innerOutputMessageErrorObj)}
		socket.WriteJSON(outputMessageObj)
		log.Printf("Sent: %s", conversions.ToJSON(outputMessageObj))
	}
}

func socketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade der Verbindung von HTTP auf websocket
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("Fehler während Upgrade der Verbindung von HTTP auf websocket:", err)
		return
	}
	defer conn.Close()

	// Main loop
	for {
		messageType, data, err := conn.ReadMessage()
		if err != nil {
			log.Println("Fehler beim lesen der websocket Nachricht:", err)
			break
		}
		log.Printf("Received: %s", data)

		var inputMessage = &structs.InputMessage{}
		conversions.ToObj(data, inputMessage)

		log.Print(inputMessage)

		switch socketProtocol := inputMessage.SocketProtocol; socketProtocol {
		case "initialization":
			fmt.Println("initialization")
			party_id := strconv.Itoa(party_id_counter)
			party_id_counter++
			initialization(inputMessage.Data, party_id, conn)
		case "share":
			fmt.Println("share")
		case "open":
			fmt.Println("open")
		case "custom":
			fmt.Println("custom")
		case "crypto_provider":
			fmt.Println("crypto_provider")
		case "disconnect":
			fmt.Println("disconnect")
		case "close":
			fmt.Println("close")
		case "free":
			fmt.Println("free")
		default:
			fmt.Println("Unimplementiertes socketProtocol:", socketProtocol)
		}

		err = conn.WriteMessage(messageType, data)
		if err != nil {
			log.Println("Fehler beim schreiben der websocket Nachricht:", err)
			break
		}
	}
}

func socketHandlerTester(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Success!"))
}

func main() {
	log.Println("Server Started!")
	assertAvailablePRNG()
	socketMaps.SocketId = make(map[string]map[string]*websocket.Conn)
	socketMaps.ComputationId = make(map[*websocket.Conn]string)
	socketMaps.PartyId = make(map[*websocket.Conn]string)
	http.HandleFunc("/test", socketHandlerTester)
	http.HandleFunc("/", socketHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
