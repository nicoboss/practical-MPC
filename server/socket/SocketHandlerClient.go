package socket

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/protocol"
	"PracticalMPC/Server/storage"
	"PracticalMPC/Server/structs"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"
)

var socketMutex = &sync.Mutex{}

func SocketHandlerClient(w http.ResponseWriter, r *http.Request) {
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
		_, data, err := conn.ReadMessage()
		if err != nil {
			log.Println("Fehler beim lesen der websocket Nachricht:", err)
			break
		}

		var inputMessage = &structs.InputMessage{}
		conversions.ToObj(data, inputMessage)

		socketMutex.Lock()
		var party_id string
		var ok bool
		if inputMessage.SocketProtocol == "initialization" {
			party_id = strconv.Itoa(storage.Party_id_counter)
			storage.Party_id_counter++
		} else if party_id, ok = storage.SocketMaps.PartyId[conn]; !ok {
			log.Fatalln("Eine neue Verbindung muss mit socketProtocol initialization beginnen!")
		}

		log.Printf("[RECEIVED][%s][%s]: %s", party_id, inputMessage.SocketProtocol, data)
		mailbox.SendReceivedToLoggers(inputMessage, party_id)

		switch socketProtocol := inputMessage.SocketProtocol; socketProtocol {
		case "initialization":
			protocol.Initialization(inputMessage.Data, party_id, conn)
		case "share":
			protocol.HandleShare(inputMessage.Data, conn)
		case "crypto_provider":
			protocol.HandleCryptoProvider(inputMessage.Data, conn)
		case "open":
			protocol.HandleOpen(inputMessage.Data, conn)
		case "custom":
			fmt.Println("custom")
		case "disconnect":
			fmt.Println("disconnect")
		case "close":
			fmt.Println("close")
		case "free":
			fmt.Println("free")
		default:
			fmt.Println("Unimplementiertes socketProtocol:", socketProtocol)
		}
		socketMutex.Unlock()
	}
}
