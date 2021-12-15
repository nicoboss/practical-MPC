package storage

import (
	"github.com/gorilla/websocket"
)

func ResetStorage() {

	for conn := range SocketMaps.PartyId {
		conn.Close()
	}

	Upgrader = websocket.Upgrader{}
	ComputationMaps = NewComputationMaps()
	SocketMaps = NewSocketMaps()
	CryptoMap = make(map[string]map[string]InnerCryptoMap) // { computation_id -> { op_id -> { 'shares': [ numeric shares for this party ], 'values': <any non-secret value(s) for this party> } } } }
	Party_id_counter = make(map[string]int)

}
