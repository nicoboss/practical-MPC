package mailbox

type InputMessagesLogger struct {
	LoggerProtocol  string `json:"loggerProtocol"`
	Time            int64  `json:"time"`
	Sender_party_id string `json:"sender_party_id"`
	Message         string `json:"message"`
}
