package structs

import "github.com/gorilla/websocket"

type SocketMaps struct {
	SocketId      map[string]map[string]*websocket.Conn
	ComputationId map[*websocket.Conn]string
	PartyId       map[*websocket.Conn]string
}

func NewSocketMaps() *SocketMaps {
	socketMaps := new(SocketMaps)
	socketMaps.SocketId = make(map[string]map[string]*websocket.Conn)
	socketMaps.ComputationId = make(map[*websocket.Conn]string)
	socketMaps.PartyId = make(map[*websocket.Conn]string)
	return socketMaps
}
