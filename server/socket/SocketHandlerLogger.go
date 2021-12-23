package socket

import (
	"PracticalMPC/Server/mailbox"
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
		log.Println("Fehler während Upgrade der Verbindung von HTTP auf websocket:", err)
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
			storage.Loggers[conn] = storage.Logger_id_counter
			message := fmt.Sprintf("Logger %d registriert!", storage.Logger_id_counter)
			mailbox.SendCacheToLogger(conn)
			mailbox.SendServerToLoggers(message)
			log.Println(message)
			storage.Logger_id_counter++
		case "unregister":
			_, ok := storage.Loggers[conn]
			if ok {
				message := fmt.Sprintf("Logger %d unregistriert!", storage.Loggers[conn])
				mailbox.SendServerToLoggers(message)
				delete(storage.Loggers, conn)
				log.Println(message)
			}
			conn.Close()
		default:
			message := fmt.Sprintf("Unimplementierte logger action: %s", action)
			mailbox.SendServerToLoggers(message)
			log.Println(message)
		}
	}
}
