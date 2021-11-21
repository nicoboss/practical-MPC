//Golang code lose basierend auf JIFF Server JavaScript Code

package main

import (
	"log"
	"net/http"

	"PracticalMPC/Server/socket"
	"PracticalMPC/Server/storage"
)

func main() {
	log.Println("Server Started!")
	storage.InitStorage()
	http.HandleFunc("/test", socket.SocketHandlerTester)
	http.HandleFunc("/logger", socket.SocketHandlerLogger)
	http.HandleFunc("/", socket.SocketHandlerClient)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
