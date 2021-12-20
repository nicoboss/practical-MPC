package storage

import "PracticalMPC/Server/JSON"

// speichert Zustände der Berechnung
type ComputationMapsStruct struct {
	ClientIds   map[string][]int            // { computation_id -> [ party1_id, party2_id, ...] } for only registered/initialized clients
	SpareIds    map[string][]bool           // { computation_id -> <interval object> }
	MaxCount    map[string]int              // { computation_id -> <max number of parties allowed> }
	Keys        map[string]map[int]JSON.Key // { computation_id -> { party_id -> <public_key> } }
	SecretKeys  map[string]JSON.Key         // { computation_id -> <privateKey> }
	FreeParties map[string]map[int]bool     // { computation_id -> { id of every free party -> true } }
}

func NewComputationMaps() *ComputationMapsStruct {
	computationMaps := new(ComputationMapsStruct)
	computationMaps.ClientIds = make(map[string][]int)
	computationMaps.SpareIds = make(map[string][]bool)
	computationMaps.MaxCount = make(map[string]int)
	computationMaps.Keys = make(map[string]map[int]JSON.Key)
	computationMaps.SecretKeys = make(map[string]JSON.Key)
	computationMaps.FreeParties = make(map[string]map[int]bool)
	return computationMaps
}
