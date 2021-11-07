package storage

import (
	"github.com/gorilla/websocket"
)

func InitStorage() {
	SocketMaps.SocketId = make(map[string]map[string]*websocket.Conn)
	SocketMaps.ComputationId = make(map[*websocket.Conn]string)
	SocketMaps.PartyId = make(map[*websocket.Conn]string)
}
