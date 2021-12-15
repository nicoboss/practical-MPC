package socket

import (
	"PracticalMPC/Server/CryptoProvider"
	"PracticalMPC/Server/Custom"
	"PracticalMPC/Server/Initialization"
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/Open"
	"PracticalMPC/Server/Share"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"fmt"
	"log"
	"net/http"
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
			return
		}

		var inputMessage = &InputMessage{}
		JSON.ToObj(data, inputMessage)

		socketMutex.Lock()
		var party_id string
		var initializationSuccessful bool
		var ok bool
		if inputMessage.SocketProtocol == "initialization" {
			party_id, initializationSuccessful = Initialization.Register(inputMessage.Data, JSON.ToJSON(inputMessage), conn)
			if !initializationSuccessful {
				break
			}
		} else if party_id, ok = storage.SocketMaps.PartyId[conn]; !ok {
			log.Printf("[RECEIVED][%s]: %s", inputMessage.SocketProtocol, data)
			mailbox.SendReceivedToLoggers(JSON.ToJSON(inputMessage), "")
			mailbox.BroadcastError("Eine neue Verbindung muss mit socketProtocol initialization beginnen!", conn)
			storage.ResetStorage()
			break
		}

		log.Printf("[RECEIVED][%s][%s]: %s", party_id, inputMessage.SocketProtocol, data)
		mailbox.SendReceivedToLoggers(JSON.ToJSON(inputMessage), party_id)

		switch socketProtocol := inputMessage.SocketProtocol; socketProtocol {
		case "initialization":
			Initialization.Initialization(inputMessage.Data, party_id, conn)
		case "share":
			Share.HandleShare(inputMessage.Data, conn)
		case "crypto_provider":
			CryptoProvider.HandleCryptoProvider(inputMessage.Data, conn)
		case "open":
			Open.HandleOpen(inputMessage.Data, conn)
		case "custom":
			Custom.HandleCustom(inputMessage.Data, conn)
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
	socketMutex.Unlock()
}
