package structs

import "PracticalMPC/Server/types"

// speichert Zustände der Berechnung
type ComputationMaps struct {
	ClientIds   map[string][]string                  // { computation_id -> [ party1_id, party2_id, ...] } for only registered/initialized clients
	SpareIds    map[string][]bool                    // { computation_id -> <interval object> }
	MaxCount    map[string]int                       // { computation_id -> <max number of parties allowed> }
	Keys        map[string]map[string]types.JSON_key // { computation_id -> { party_id -> <public_key> } }
	SecretKeys  map[string]types.JSON_key            // { computation_id -> <privateKey> }
	FreeParties map[string]map[string]bool           // { computation_id -> { id of every free party -> true } }
}

func NewComputationMaps() *ComputationMaps {
	computationMaps := new(ComputationMaps)
	computationMaps.ClientIds = make(map[string][]string)
	computationMaps.SpareIds = make(map[string][]bool)
	computationMaps.MaxCount = make(map[string]int)
	computationMaps.Keys = make(map[string]map[string]types.JSON_key)
	computationMaps.SecretKeys = make(map[string]types.JSON_key)
	computationMaps.FreeParties = make(map[string]map[string]bool)
	return computationMaps
}
