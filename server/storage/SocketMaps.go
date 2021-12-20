package storage

import "github.com/gorilla/websocket"

type SocketMapsStruct struct {
	SocketId      map[string]map[int]*websocket.Conn
	ComputationId map[*websocket.Conn]string
	PartyId       map[*websocket.Conn]int
}

func NewSocketMaps() *SocketMapsStruct {
	socketMaps := new(SocketMapsStruct)
	socketMaps.SocketId = make(map[string]map[int]*websocket.Conn)
	socketMaps.ComputationId = make(map[*websocket.Conn]string)
	socketMaps.PartyId = make(map[*websocket.Conn]int)
	return socketMaps
}
