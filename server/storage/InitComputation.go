package storage

import (
	"PracticalMPC/Server/JSON"

	"github.com/gorilla/websocket"
)

func InitComputation(computation_id string, party_count int) int {
	if ComputationMaps.ClientIds[computation_id] == nil {
		Party_id_counter[computation_id] = 1
		ComputationMaps.ClientIds[computation_id] = make([]int, party_count)
		ComputationMaps.MaxCount[computation_id] = party_count
		ComputationMaps.FreeParties[computation_id] = make(map[int]bool)
		ComputationMaps.Keys[computation_id] = make(map[int]JSON.Key)
		SocketMaps.SocketId[computation_id] = make(map[int]*websocket.Conn)
		CryptoMap[computation_id] = make(map[string]InnerCryptoMap)
	}

	ComputationMaps.ClientIds[computation_id] = append(ComputationMaps.ClientIds[computation_id], Party_id_counter[computation_id])
	Party_id_counter[computation_id]++

	return Party_id_counter[computation_id] - 1
}
