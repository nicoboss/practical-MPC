package storage

import "github.com/gorilla/websocket"

type SocketMapsStruct struct {
	SocketId      map[string]map[string]*websocket.Conn
	ComputationId map[*websocket.Conn]string
	PartyId       map[*websocket.Conn]string
}

func NewSocketMaps() *SocketMapsStruct {
	socketMaps := new(SocketMapsStruct)
	socketMaps.SocketId = make(map[string]map[string]*websocket.Conn)
	socketMaps.ComputationId = make(map[*websocket.Conn]string)
	socketMaps.PartyId = make(map[*websocket.Conn]string)
	return socketMaps
}
