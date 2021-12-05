package Custom

type MessageDataInsecureCustom struct {
	Tag       string `json:"tag"`
	Party_id  int    `json:"party_id"`
	Message   string `json:"message"`
	Encrypted bool   `json:"encrypted"`
}
