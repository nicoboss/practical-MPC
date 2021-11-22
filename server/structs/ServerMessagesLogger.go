package structs

type ServerMessageLogger struct {
	LoggerProtocol string `json:"loggerProtocol"`
	Message        string `json:"message"`
}
