package structs

type MessageDataInsecureOpen struct {
	Party_id int    `json:"party_id"`
	Share    string `json:"share"`
	Op_id    string `json:"op_id"`
	Zp       int    `json:"Zp"`
}
