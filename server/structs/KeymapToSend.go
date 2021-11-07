package structs

import "PracticalMPC/Server/types"

type KeymapToSend struct {
	Public_keys map[string]types.JSON_key `json:"public_keys"`
}

func NewKeymapToSend() *KeymapToSend {
	keymapToSend := new(KeymapToSend)
	keymapToSend.Public_keys = make(map[string]types.JSON_key)
	return keymapToSend
}
