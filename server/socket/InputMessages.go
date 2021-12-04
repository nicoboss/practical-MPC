package socket

type InputMessage struct {
	SocketProtocol string `json:"socketProtocol"`
	Data           string `json:"data"`
}
