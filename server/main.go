package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type SocketMaps struct {
	SocketId      map[string]map[int]*websocket.Conn
	ComputationId map[*websocket.Conn]string
	PartyId       map[*websocket.Conn]int
}

type InputMessage struct {
	SocketProtocol string
	Data           string
}

type InputMessageDataInitialization struct {
	Computation_id string
	Party_count    int
	Public_key     string
}

type OutputMessage struct {
	SocketProtocol string
	Data           string
}

type InnerOutputMessageError struct {
	ErrorProtocol string
	Error         string
}

type InitializePartyError struct {
	success bool
	error   string
}

type InitializePartyMsg struct {
	party_id    int
	party_count int
	public_keys string
}

func toJSON(obj interface{}) string {
	jsonObj, err := json.Marshal(obj)
	if err != nil {
		log.Fatalln(err)
	}
	return string(jsonObj)
}

func toObj(str []byte, obj interface{}) {
	err := json.Unmarshal(str, obj)
	if err != nil {
		panic(err)
	}
}

var upgrader = websocket.Upgrader{}
var socketMaps = new(SocketMaps)

func initializeParty(computation_id string, party_id int, party_count int, _s1 bool) (bool, InitializePartyMsg) {
	var message = InitializePartyMsg{party_id: 0, party_count: 0, public_keys: ""}
	return true, message
}

func initialization(data string, party_id int, socket *websocket.Conn) {

	var inputData = &InputMessageDataInitialization{}
	toObj([]byte(data), inputData)

	success, message := initializeParty(inputData.Computation_id, party_id, inputData.Party_count, false)

	if socketMaps.SocketId[inputData.Computation_id] == nil {
		socketMaps.SocketId[inputData.Computation_id] = make(map[int]*websocket.Conn)
	}

	if success {
		socketMaps.SocketId[inputData.Computation_id][message.party_id] = socket
		socketMaps.ComputationId[socket] = inputData.Computation_id
		socketMaps.PartyId[socket] = message.party_id

		party_id = message.party_id
		outputMessageObj := &OutputMessage{SocketProtocol: "initialization", Data: toJSON(message)}
		socket.WriteJSON(outputMessageObj)
		log.Printf("Sent: %s", toJSON(outputMessageObj))
	} else {
		innerOutputMessageErrorObj := &InnerOutputMessageError{ErrorProtocol: "initialization", Error: toJSON(message)}
		outputMessageObj := &OutputMessage{SocketProtocol: "error", Data: toJSON(innerOutputMessageErrorObj)}
		socket.WriteJSON(outputMessageObj)
		log.Printf("Sent: %s", toJSON(outputMessageObj))
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

		var inputMessage = &InputMessage{}
		toObj(data, inputMessage)
		log.Printf("Unmarshaled: %s", inputMessage.Data)

		log.Print(inputMessage)
		party_id := 0

		switch socketProtocol := inputMessage.SocketProtocol; socketProtocol {
		case "initialization":
			fmt.Println("initialization")
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

func main() {
	log.Println("Server Started!")
	socketMaps.SocketId = make(map[string]map[int]*websocket.Conn)
	socketMaps.SocketId = make(map[string]map[int]*websocket.Conn)
	socketMaps.ComputationId = make(map[*websocket.Conn]string)
	socketMaps.PartyId = make(map[*websocket.Conn]int)
	http.HandleFunc("/", socketHandler)
	log.Fatal(http.ListenAndServe("127.0.0.1:8080", nil))
}
