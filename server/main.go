package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{}

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
		msg := map[string]string{}
		json.Unmarshal([]byte(data), &msg)
		log.Print(msg)

		switch socketProtocol := msg["socketProtocol"]; socketProtocol {
		case "initialization":
			fmt.Println("initialization")
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
			fmt.Printf("Unimplementiertes socketProtocol: %s.\n", socketProtocol)
		}

		err = conn.WriteMessage(messageType, data)
		if err != nil {
			log.Println("Fehler beim schreiben der websocket Nachricht:", err)
			break
		}
	}
}

func main() {
	http.HandleFunc("/", socketHandler)
	log.Fatal(http.ListenAndServe("127.0.0.1:8080", nil))
}
