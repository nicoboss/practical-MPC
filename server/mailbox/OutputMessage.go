package mailbox

type OutputMessage struct {
	SocketProtocol string `json:"socketProtocol"`
	Data           string `json:"data"`
}
