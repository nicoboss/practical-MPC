//Golang code lose basierend auf JIFF Server JavaScript Code

package main

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/websocket"
	"github.com/miguelsandro/curve25519-go/axlsign"
	//"github.com/miguelsandro/curve25519-go/axlsign"
	//"github.com/jamesruan/sodium" //choco install pkgconfiglite
)

// speichert Zustände der Berechnung
type ComputationMaps struct {
	ClientIds   map[string][]string           // { computation_id -> [ party1_id, party2_id, ...] } for only registered/initialized clients
	SpareIds    map[string][]bool             // { computation_id -> <interval object> }
	MaxCount    map[string]int                // { computation_id -> <max number of parties allowed> }
	Keys        map[string]map[string][]uint8 // { computation_id -> { party_id -> <public_key> } }
	SecretKeys  map[string][]uint8            // { computation_id -> <privateKey> }
	FreeParties map[string]map[string]bool    // { computation_id -> { id of every free party -> true } }
}

type SocketMaps struct {
	SocketId      map[string]map[string]*websocket.Conn
	ComputationId map[*websocket.Conn]string
	PartyId       map[*websocket.Conn]string
}

type InputMessage struct {
	SocketProtocol string
	Data           string
}

type InputMessageDataInitialization struct {
	Computation_id string
	Party_count    int
	Public_key     string
}

type OutputMessage struct {
	SocketProtocol string
	Data           string
}

type InnerOutputMessageError struct {
	ErrorProtocol string
	Error         string
}

type InitializePartyMsg struct {
	party_id    string
	party_count int
	public_keys map[string]string
}

type InnerCryptoMap struct {
	shares []string
	values []string
}

type KeymapToSend struct {
	public_keys map[string]string
}

var upgrader = websocket.Upgrader{}
var computationMaps = new(ComputationMaps)
var socketMaps = new(SocketMaps)
var mailbox = make(map[string]map[string][]string)                    // { computation_id -> { party_id -> linked_list<[ message1, message2, ... ]> } }
var cryptoMap = make(map[string]map[string]map[string]InnerCryptoMap) // { computation_id -> { op_id -> { party_id -> { 'shares': [ numeric shares for this party ], 'values': <any non-secret value(s) for this party> } } } }

func toJSON(obj interface{}) string {
	jsonObj, err := json.Marshal(obj)
	if err != nil {
		log.Fatalln(err)
	}
	return string(jsonObj)
}

func toObj(str []byte, obj interface{}) {
	err := json.Unmarshal(str, obj)
	if err != nil {
		panic(err)
	}
}

func getPartyIdInt(party_id string) int {
	party_id_int, err := strconv.Atoi(party_id)
	if err != nil {
		log.Fatal("party_id ist keine Ganzzahl")
	}
	return party_id_int
}

func contains(s []string, str string) bool {
	for _, item := range s {
		if item == str {
			return true
		}
	}
	return false
}

func assertAvailablePRNG() {
	buf := make([]byte, 1)
	_, err := io.ReadFull(rand.Reader, buf)
	if err != nil {
		panic(fmt.Sprintf("Kein kryptographisch sicheren Zufallsgenerator vorhanden: crypto/rand: Read() failed with %#v", err))
	}
}

func GenerateRandomBytes(n int) []uint8 {
	b := make([]uint8, n)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}
	return b
}

func parseKey(keyString string) []byte {
	var arr []byte
	toObj([]byte(keyString), &arr)
	return arr
}

func dumpKey(key []byte) string {
	return ("[" + string(key) + "]")
}

func initComputation(computation_id string, party_id string, party_count int) {
	if computationMaps.ClientIds[computation_id] == nil {
		computationMaps.ClientIds[computation_id] = make([]string, party_count)
		computationMaps.MaxCount[computation_id] = party_count
		computationMaps.FreeParties[computation_id] = make(map[string]bool)
		computationMaps.Keys[computation_id] = make(map[string][]uint8)
		socketMaps.SocketId[computation_id] = make(map[string]*websocket.Conn)
		mailbox[computation_id] = make(map[string][]string)
		cryptoMap[computation_id] = make(map[string]map[string]InnerCryptoMap)
	}

	if !(contains(computationMaps.ClientIds[computation_id], party_id)) {
		computationMaps.ClientIds[computation_id] = append(computationMaps.ClientIds[computation_id], party_id)
	}
}

func storeAndSendPublicKey(computation_id string, party_id string, public_key string) map[string]string {
	// Öffendlicher Schlüssel speichern
	var tmp = computationMaps.Keys[computation_id]
	if _, ok := tmp["s1"]; !ok { // Public/Private Schlüsselpaar generieren falls diese noch nicht existieren
		var genkey = axlsign.GenerateKeyPair(GenerateRandomBytes(32)) // Generieren des Schlüsselpaars
		computationMaps.SecretKeys[computation_id] = genkey.PrivateKey
		tmp["s1"] = genkey.PublicKey
	}

	if party_id != "s1" {
		tmp[party_id] = parseKey(public_key)
	}

	// Sammeln und formatieren der Schlüssel
	var keymap_to_send = new(KeymapToSend)
	keymap_to_send.public_keys = make(map[string]string)
	for key, _ := range tmp {
		if val, ok := computationMaps.Keys[computation_id][key]; !ok {
			keymap_to_send.public_keys[key] = dumpKey(val)
		}
	}
	var broadcast_message = toJSON(keymap_to_send)

	// Öffentlicher Schlüssel an alle zuvor verbundenen Parteien ausser der Partei welche dieses Update verursacht hat senden
	for _, party := range computationMaps.ClientIds[computation_id] {
		if party != party_id {
			//safe_emit("public_keys", broadcast_message, computation_id, party)
			log.Println("public_keys", broadcast_message, computation_id, party)
		}
	}

	return keymap_to_send.public_keys
}

// Initialisierung einer Partei. Rückgabe: Initialisierungsnachricht mit der Partei-ID oder eine Fehlermeldung
func initializeParty(computation_id string, party_id string, public_key string, party_count int, _s1 bool) (bool, InitializePartyMsg) {

	log.Println("Server inizialisiert mit ", computation_id, "-", party_id, " #", party_count, "::", _s1)

	if _s1 != true && party_id == "s1" {
		log.Fatal("party_id s1 ist für den Server reserviert und darf nicht von einem Client verwendet werden!")
	}

	// Liste aller noch verfügbaren Partei erstellen
	if computationMaps.SpareIds[computation_id] == nil {
		computationMaps.SpareIds[computation_id] = make([]bool, party_count)
	}

	if party_id != "" {
		if party_id != "s1" && !computationMaps.SpareIds[computation_id][getPartyIdInt(party_id)] == false {
			log.Fatal("party_id existiert schon")
		}
	} else { // generate einer freien party_id
		var currentSpareIds = computationMaps.SpareIds[computation_id]
		for i := range currentSpareIds {
			if currentSpareIds[i] == false {
				party_id = string(i)
				break
			}
		}
	}

	if party_id != "s1" {
		computationMaps.SpareIds[computation_id][getPartyIdInt(party_id)] = true
	}

	// Initialisierung der Berechnung und definieren aller noch undefinierten Objekten.
	initComputation(computation_id, party_id, party_count)

	// Initialisierungsnachricht für den Client erstellen
	keymap_to_send := storeAndSendPublicKey(computation_id, party_id, public_key)

	var message = InitializePartyMsg{party_id: party_id, party_count: 0, public_keys: keymap_to_send}
	return true, message
}

func initialization(data string, party_id string, socket *websocket.Conn) {

	var inputData = &InputMessageDataInitialization{}
	toObj([]byte(data), inputData)

	success, message := initializeParty(inputData.Computation_id, party_id, inputData.Public_key, inputData.Party_count, false)

	if socketMaps.SocketId[inputData.Computation_id] == nil {
		socketMaps.SocketId[inputData.Computation_id] = make(map[string]*websocket.Conn)
	}

	if success {
		socketMaps.SocketId[inputData.Computation_id][message.party_id] = socket
		socketMaps.ComputationId[socket] = inputData.Computation_id
		socketMaps.PartyId[socket] = message.party_id

		party_id = message.party_id
		outputMessageObj := &OutputMessage{
			SocketProtocol: "initialization",
			Data:           toJSON(message),
		}
		socket.WriteJSON(outputMessageObj)
		log.Printf("Sent: %s", toJSON(outputMessageObj))

		// Now that party is connected and has the needed public keys,
		// send the mailbox with pending messages to the party.
		// jiff.resend_mailbox(computation_id, party_id)
	} else {
		// Change error to its own protocol type since ws does not support error messages natively
		/* Messages sent over socket.io are now under the label 'data' while previously used protocols are sent under 'socketProtocol' */
		innerOutputMessageErrorObj := &InnerOutputMessageError{ErrorProtocol: "initialization", Error: toJSON(message)}
		outputMessageObj := &OutputMessage{SocketProtocol: "error", Data: toJSON(innerOutputMessageErrorObj)}
		socket.WriteJSON(outputMessageObj)
		log.Printf("Sent: %s", toJSON(outputMessageObj))
	}
}

func socketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade der Verbindung von HTTP auf websocket
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("Fehler während Upgrade der Verbindung von HTTP auf websocket:", err)
		return
	}
	defer conn.Close()

	// Main loop
	for {
		messageType, data, err := conn.ReadMessage()
		if err != nil {
			log.Println("Fehler beim lesen der websocket Nachricht:", err)
			break
		}
		log.Printf("Received: %s", data)

		var inputMessage = &InputMessage{}
		toObj(data, inputMessage)
		log.Printf("Unmarshaled: %s", inputMessage.Data)

		log.Print(inputMessage)
		party_id := "party_id"

		switch socketProtocol := inputMessage.SocketProtocol; socketProtocol {
		case "initialization":
			fmt.Println("initialization")
			initialization(inputMessage.Data, party_id, conn)
		case "share":
			fmt.Println("share")
		case "open":
			fmt.Println("open")
		case "custom":
			fmt.Println("custom")
		case "crypto_provider":
			fmt.Println("crypto_provider")
		case "disconnect":
			fmt.Println("disconnect")
		case "close":
			fmt.Println("close")
		case "free":
			fmt.Println("free")
		default:
			fmt.Println("Unimplementiertes socketProtocol:", socketProtocol)
		}

		err = conn.WriteMessage(messageType, data)
		if err != nil {
			log.Println("Fehler beim schreiben der websocket Nachricht:", err)
			break
		}
	}
}

func socketHandlerTester(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Success!"))
}

func main() {
	log.Println("Server Started!")
	assertAvailablePRNG()
	socketMaps.SocketId = make(map[string]map[string]*websocket.Conn)
	socketMaps.ComputationId = make(map[*websocket.Conn]string)
	socketMaps.PartyId = make(map[*websocket.Conn]string)
	http.HandleFunc("/test", socketHandlerTester)
	http.HandleFunc("/", socketHandler)
	log.Fatal(http.ListenAndServe("server.mpc.nico.re:8080", nil))
}
