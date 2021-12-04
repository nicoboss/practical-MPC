package Open

type MessageDataOpen struct {
	Party_id int    `json:"party_id"`
	Share    Share  `json:"share"`
	Op_id    string `json:"op_id"`
	Zp       int    `json:"Zp"`
}
