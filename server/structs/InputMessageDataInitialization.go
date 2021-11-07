package structs

import "PracticalMPC/Server/types"

type InputMessageDataInitialization struct {
	Computation_id string
	Party_count    int
	Public_key     types.JSON_key
}
