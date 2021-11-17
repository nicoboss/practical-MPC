package storage

import (
	"PracticalMPC/Server/structs"

	"github.com/gorilla/websocket"
)

var Upgrader = websocket.Upgrader{}
var ComputationMaps = structs.NewComputationMaps()
var SocketMaps = structs.NewSocketMaps()
var CryptoMap = make(map[string]map[string]structs.InnerCryptoMap) // { computation_id -> { op_id -> { 'shares': [ numeric shares for this party ], 'values': <any non-secret value(s) for this party> } } } }
var Party_id_counter int = 1
