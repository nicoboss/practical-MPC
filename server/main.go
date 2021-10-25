package main

import (
	"encoding/json"
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
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Fehler beim lesen der websocket Nachricht:", err)
			break
		}
		log.Printf("Received: %s", message)
		data := map[string]string{}
		json.Unmarshal([]byte(message), &data)
		log.Print(data)
		err = conn.WriteMessage(messageType, message)
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
