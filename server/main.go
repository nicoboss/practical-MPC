// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"flag"
	"log"
	"net/http"
	"net/url"
)

var addr = flag.String("addr", ":8080", "http service address")

func handleSocketIoRequest(w http.ResponseWriter, r *http.Request) {
	m, _ := url.ParseQuery(r.URL.RawQuery)
	log.Println("EIO: ", m["EIO"])             // the current version of the Engine.IO protocol
	log.Println("transport: ", m["transport"]) // the transport being established
	log.Println("t: ", m["t"])                 // a hashed timestamp for cache-busting

	//m := {
	//	"type": "open",
	//	"data": {
	//		"sid":          "36Yib8-rSutGQYLfAAAD", // the unique session id
	//		"upgrades":     {"websocket"},          // the list of possible transport upgrades
	//		"pingInterval": 25000,                  // the 1st parameter for the heartbeat mechanism
	//		"pingTimeout":  5000,                   // the 2nd parameter for the heartbeat mechanism
	//	},
	//}
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "Access-Control-Allow-Methods")
	log.Println(r.URL)

	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if r.URL.Path == "/" {
		http.ServeFile(w, r, "home.html")
		return
	}
	//if strings.HasPrefix(r.URL.Path, "/socket.io/?") {
	handleSocketIoRequest(w, r)
	return
	//}

	http.Error(w, "Not found", http.StatusNotFound)
}

func main() {
	flag.Parse()
	hub := newHub()
	go hub.run()
	http.HandleFunc("/", serveHome)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		r.Header.Set("Access-Control-Allow-Origin", "*")
		serveWs(hub, w, r)
	})
	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
