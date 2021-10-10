package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

func getRequest(url string) string {
	for n := 0; n <= 30; n++ {
		resp, err := http.Get(url)
		if err != nil {
			log.Fatalln(err)
			time.Sleep(time.Second)
			continue
		}
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatalln(err)
			time.Sleep(time.Second)
			continue
		}
		responseBody := string(body)
		return responseBody
	}
	panic("Zu viele Fehlversuche!")
}

func main() {
	log.Printf(getRequest("http://client.mpc.nico.re:8080"))
	log.Printf(getRequest("http://server.mpc.nico.re:8080"))
}
