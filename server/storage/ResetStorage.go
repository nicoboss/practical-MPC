package storage

import (
	"PracticalMPC/Server/structs"

	"github.com/gorilla/websocket"
)

func ResetStorage() {
	Upgrader = websocket.Upgrader{}
	ComputationMaps = structs.NewComputationMaps()
	SocketMaps = structs.NewSocketMaps()
	CryptoMap = make(map[string]map[string]structs.InnerCryptoMap) // { computation_id -> { op_id -> { 'shares': [ numeric shares for this party ], 'values': <any non-secret value(s) for this party> } } } }
	Party_id_counter = 1
	Loggers = make(map[*websocket.Conn]int)
	Logger_id_counter = 1
}
