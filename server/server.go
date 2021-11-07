//Golang code lose basierend auf JIFF Server JavaScript Code

package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/crypto"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"PracticalMPC/Server/structs"
	"PracticalMPC/Server/types"

	"github.com/gorilla/websocket"
)

// Initialisierung einer Partei. Rückgabe: Initialisierungsnachricht mit der Partei-ID oder eine Fehlermeldung
func initializeParty(computation_id string, party_id string, public_key types.JSON_key, party_count int, _s1 bool) (bool, *structs.InitializePartyMsg) {

	log.Println("Server inizialisiert mit ", computation_id, "-", party_id, " #", party_count, "::", _s1)

	if !_s1 && party_id == "s1" {
		log.Fatal("party_id s1 ist für den Server reserviert und darf nicht von einem Client verwendet werden!")
	}

	// Liste aller noch verfügbaren Partei erstellen
	if storage.ComputationMaps.SpareIds[computation_id] == nil {
		storage.ComputationMaps.SpareIds[computation_id] = make([]bool, party_count)
	}

	if party_id != "" {
		if party_id != "s1" && storage.ComputationMaps.SpareIds[computation_id][conversions.GetPartyIdInt(party_id)-1] {
			log.Fatal("party_id existiert schon")
		}
	} else { // generate einer freien party_id
		var currentSpareIds = storage.ComputationMaps.SpareIds[computation_id]
		for i := range currentSpareIds {
			if !currentSpareIds[i] {
				party_id = fmt.Sprint(i)
				break
			}
		}
	}

	if party_id != "s1" {
		storage.ComputationMaps.SpareIds[computation_id][conversions.GetPartyIdInt(party_id)-1] = true
	}

	// Initialisierung der Berechnung und definieren aller noch undefinierten Objekten.
	storage.InitComputation(computation_id, party_id, party_count)

	// Initialisierungsnachricht für den Client erstellen
	keymap_to_send := crypto.StoreAndSendPublicKey(storage.ComputationMaps, computation_id, party_id, public_key)

	var message = structs.NewInitializePartyMsg(party_id, party_count, keymap_to_send)
	return true, message
}

func initialization(data string, party_id string, socket *websocket.Conn) {

	var inputData = &structs.InputMessageDataInitialization{}
	conversions.ToObj([]byte(data), inputData)
	success, message := initializeParty(inputData.Computation_id, party_id, inputData.Public_key, inputData.Party_count, false)

	if storage.SocketMaps.SocketId[inputData.Computation_id] == nil {
		storage.SocketMaps.SocketId[inputData.Computation_id] = make(map[string]*websocket.Conn)
	}

	mailbox.SendMails(storage.SocketMaps, inputData.Computation_id)

	if success {
		storage.SocketMaps.SocketId[inputData.Computation_id][message.Party_id] = socket
		storage.SocketMaps.ComputationId[socket] = inputData.Computation_id
		storage.SocketMaps.PartyId[socket] = message.Party_id
		outputMessageObj := &structs.OutputMessage{
			SocketProtocol: "initialization",
			Data:           conversions.ToJSON(message),
		}
		socket.WriteJSON(outputMessageObj)
		log.Printf("Sent: %s", conversions.ToJSON(outputMessageObj))
	} else {
		innerOutputMessageErrorObj := &structs.InnerOutputMessageError{ErrorProtocol: "initialization", Error: conversions.ToJSON(message)}
		outputMessageObj := &structs.OutputMessage{SocketProtocol: "error", Data: conversions.ToJSON(innerOutputMessageErrorObj)}
		socket.WriteJSON(outputMessageObj)
		log.Printf("Sent: %s", conversions.ToJSON(outputMessageObj))
	}
}

func socketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade der Verbindung von HTTP auf websocket
	storage.Upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	conn, err := storage.Upgrader.Upgrade(w, r, nil)
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
			party_id := strconv.Itoa(storage.Party_id_counter)
			storage.Party_id_counter++
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
	storage.SocketMaps.SocketId = make(map[string]map[string]*websocket.Conn)
	storage.SocketMaps.ComputationId = make(map[*websocket.Conn]string)
	storage.SocketMaps.PartyId = make(map[*websocket.Conn]string)
	http.HandleFunc("/test", socketHandlerTester)
	http.HandleFunc("/", socketHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
