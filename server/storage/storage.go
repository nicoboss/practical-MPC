package storage

import (
	"github.com/gorilla/websocket"
)

var Upgrader = websocket.Upgrader{}
var ComputationMaps = NewComputationMaps()
var SocketMaps = NewSocketMaps()
var CryptoMap = make(map[string]map[string]InnerCryptoMap) // { computation_id -> { op_id -> { 'shares': [ numeric shares for this party ], 'values': <any non-secret value(s) for this party> } } } }
var Party_id_counter = make(map[string]int)
var Loggers = make(map[*websocket.Conn]int)
var Logger_id_counter int = 1
