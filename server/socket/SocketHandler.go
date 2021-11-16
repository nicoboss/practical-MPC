package socket

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/protocol"
	"PracticalMPC/Server/storage"
	"PracticalMPC/Server/structs"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

func SocketHandler(w http.ResponseWriter, r *http.Request) {
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
		log.Printf("Received: %s", data)

		var inputMessage = &structs.InputMessage{}
		conversions.ToObj(data, inputMessage)

		log.Print(inputMessage)

		switch socketProtocol := inputMessage.SocketProtocol; socketProtocol {
		case "initialization":
			fmt.Println("initialization")
			party_id := strconv.Itoa(storage.Party_id_counter)
			storage.Party_id_counter++
			protocol.Initialization(inputMessage.Data, party_id, conn)
		case "share":
			fmt.Println("share")
			protocol.HandleShare(inputMessage.Data, conn)
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
	}
}
