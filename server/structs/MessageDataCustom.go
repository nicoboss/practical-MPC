package structs

type MessageDataCustom struct {
	Tag       string                 `json:"tag"`
	Party_id  int                    `json:"party_id"`
	Message   map[string]interface{} `json:"message"`
	Encrypted bool                   `json:"encrypted"`
}
