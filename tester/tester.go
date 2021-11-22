package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
)

func getRequest(url string) string {
	for n := 0; n <= 30; n++ {
		resp, err := http.Get(url)
		if err != nil {
			log.Println(err)
			log.Println("In einer Sekunde erneut versuchen...")
			time.Sleep(time.Second)
			continue
		}
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Println(err)
			log.Println("In einer Sekunde erneut versuchen...")
			time.Sleep(time.Second)
			continue
		}
		responseBody := string(body)
		return responseBody
	}
	log.Fatalln("Zu viele Fehlversuche!")
	panic("Zu viele Fehlversuche!")
}

func main() {

	// Standartwerte können mit Command Line Arguments überschreiben werden
	clientAddress := "http://client.mpc.nico.re:8080"
	serverAddress := "http://server.mpc.nico.re:8080/test"

	args := os.Args[1:]
	if len(args) >= 2 {
		clientAddress = args[0]
		serverAddress = args[1]
	}

	log.Printf(getRequest(clientAddress))
	log.Printf(getRequest(serverAddress))
}
