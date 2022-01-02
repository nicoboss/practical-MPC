package mailbox

type ServerMessageLogger struct {
	LoggerProtocol string `json:"loggerProtocol"`
	Time           int64  `json:"time"`
	Message        string `json:"message"`
}
