package structs

type MessageDataShare struct {
	Party_id int   `json:"party_id"`
	Share    Share `json:"share"`
}
