package Initialization

import "PracticalMPC/Server/JSON"

type InitializePartyMsg struct {
	Party_id    int                 `json:"party_id"`
	Party_count int                 `json:"party_count"`
	Public_keys map[string]JSON.Key `json:"public_keys"`
}

func NewInitializePartyMsg(party_id int, party_count int, public_keys map[string]JSON.Key) *InitializePartyMsg {
	initializePartyMsg := new(InitializePartyMsg)
	initializePartyMsg.Party_id = party_id
	initializePartyMsg.Party_count = party_count
	initializePartyMsg.Public_keys = public_keys
	return initializePartyMsg
}
