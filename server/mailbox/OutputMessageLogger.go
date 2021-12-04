package mailbox

type OutputMessageLogger struct {
	LoggerProtocol    string `json:"loggerProtocol"`
	Reciever_party_id string `json:"receiver_party_id"`
	Message           string `json:"message"`
}
