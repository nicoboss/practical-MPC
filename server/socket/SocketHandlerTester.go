package socket

import "net/http"

func SocketHandlerTester(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Success!"))
}
