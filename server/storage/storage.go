package storage

import (
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/structs"
	"PracticalMPC/Server/types"

	"github.com/gorilla/websocket"
)

var Upgrader = websocket.Upgrader{}
var ComputationMaps = structs.NewComputationMaps()
var SocketMaps = structs.NewSocketMaps()
var CryptoMap = make(map[string]map[string]map[string]structs.InnerCryptoMap) // { computation_id -> { op_id -> { party_id -> { 'shares': [ numeric shares for this party ], 'values': <any non-secret value(s) for this party> } } } }
var Party_id_counter int = 1

func ResetStorage() {
	Upgrader = websocket.Upgrader{}
	ComputationMaps = structs.NewComputationMaps()
	SocketMaps = structs.NewSocketMaps()
	CryptoMap = make(map[string]map[string]map[string]structs.InnerCryptoMap) // { computation_id -> { op_id -> { party_id -> { 'shares': [ numeric shares for this party ], 'values': <any non-secret value(s) for this party> } } } }
	Party_id_counter = 1
}

func InitComputation(computation_id string, party_id string, party_count int) {
	if ComputationMaps.ClientIds[computation_id] == nil {
		ComputationMaps.ClientIds[computation_id] = make([]string, party_count)
		ComputationMaps.MaxCount[computation_id] = party_count
		ComputationMaps.FreeParties[computation_id] = make(map[string]bool)
		ComputationMaps.Keys[computation_id] = make(map[string]types.JSON_key)
		SocketMaps.SocketId[computation_id] = make(map[string]*websocket.Conn)
		mailbox.Init(computation_id)
		CryptoMap[computation_id] = make(map[string]map[string]structs.InnerCryptoMap)
	}

	if !(types.Contains(ComputationMaps.ClientIds[computation_id], party_id)) {
		ComputationMaps.ClientIds[computation_id] = append(ComputationMaps.ClientIds[computation_id], party_id)
	}
}
