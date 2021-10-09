package main

import (
	"io/ioutil"
	"log"
	"net/http"
)

func getRequest(url string) string {
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	responseBody := string(body)
	return responseBody
}

func main() {
	log.Printf(getRequest("http://client.mpc.nico.re:8080"))
	log.Printf(getRequest("http://server.mpc.nico.re:8080"))
}
