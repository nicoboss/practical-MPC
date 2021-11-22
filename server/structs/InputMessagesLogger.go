package structs

type InputMessagesLogger struct {
	LoggerProtocol  string `json:"loggerProtocol"`
	Sender_party_id string `json:"sender_party_id"`
	Message         string `json:"message"`
}
