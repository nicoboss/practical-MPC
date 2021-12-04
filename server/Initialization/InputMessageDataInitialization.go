package Initialization

import "PracticalMPC/Server/JSON"

type InputMessageDataInitialization struct {
	Computation_id string
	Party_count    int
	Public_key     JSON.Key
}
