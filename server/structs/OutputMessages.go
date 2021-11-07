package structs

type OutputMessage struct {
	SocketProtocol string `json:"socketProtocol"`
	Data           string `json:"data"`
}

type InnerOutputMessageError struct {
	ErrorProtocol string
	Error         string
}
