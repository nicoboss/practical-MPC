package structs

import "PracticalMPC/Server/types"

type InitializePartyMsg struct {
	Party_id    string                    `json:"party_id"`
	Party_count int                       `json:"party_count"`
	Public_keys map[string]types.JSON_key `json:"public_keys"`
}

func NewInitializePartyMsg(party_id string, party_count int, public_keys map[string]types.JSON_key) *InitializePartyMsg {
	initializePartyMsg := new(InitializePartyMsg)
	initializePartyMsg.Party_id = party_id
	initializePartyMsg.Party_count = party_count
	initializePartyMsg.Public_keys = public_keys
	return initializePartyMsg
}
