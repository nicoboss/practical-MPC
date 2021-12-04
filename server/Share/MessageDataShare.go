package Share

type MessageDataShare struct {
	Party_id int    `json:"party_id"`
	Share    Share  `json:"share"`
	Op_id    string `json:"op_id"`
}
