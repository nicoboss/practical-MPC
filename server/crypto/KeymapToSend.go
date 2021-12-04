package crypto

import "PracticalMPC/Server/JSON"

type KeymapToSend struct {
	Public_keys map[string]JSON.Key `json:"public_keys"`
}

func NewKeymapToSend() *KeymapToSend {
	keymapToSend := new(KeymapToSend)
	keymapToSend.Public_keys = make(map[string]JSON.Key)
	return keymapToSend
}
