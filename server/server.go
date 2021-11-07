//Golang code lose basierend auf JIFF Server JavaScript Code

package main

import (
	"log"
	"net/http"

	"PracticalMPC/Server/socket"
	"PracticalMPC/Server/storage"

	"github.com/gorilla/websocket"
)

func main() {
	log.Println("Server Started!")
	storage.SocketMaps.SocketId = make(map[string]map[string]*websocket.Conn)
	storage.SocketMaps.ComputationId = make(map[*websocket.Conn]string)
	storage.SocketMaps.PartyId = make(map[*websocket.Conn]string)
	http.HandleFunc("/test", socket.SocketHandlerTester)
	http.HandleFunc("/", socket.SocketHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
