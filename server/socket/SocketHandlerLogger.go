package socket

import (
	"PracticalMPC/Server/storage"
	"fmt"
	"log"
	"net/http"
)

func SocketHandlerLogger(w http.ResponseWriter, r *http.Request) {
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

		action := string(data)
		log.Printf("[RECEIVED]: %s", action)

		switch action {
		case "register":
			storage.Logger_id_counter++
			storage.Loggers[conn] = storage.Logger_id_counter
			outputMsg := fmt.Sprintf("Logger %d registriert!", storage.Logger_id_counter)
			conn.WriteMessage(1, []byte(outputMsg))
		case "unregister":
			_, ok := storage.Loggers[conn]
			if ok {
				delete(storage.Loggers, conn)
			}
			conn.Close()
		default:
			log.Println("Unimplementierte logger action:", action)
		}
	}
}
