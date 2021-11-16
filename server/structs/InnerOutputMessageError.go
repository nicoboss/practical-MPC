package structs

type InnerOutputMessageError struct {
	ErrorProtocol string `json:"errorProtocol"`
	Error         string `json:"error"`
}
