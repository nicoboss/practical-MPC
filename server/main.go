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
	"strings"

	"github.com/gorilla/websocket"
	"github.com/miguelsandro/curve25519-go/axlsign"
)

type JSON_key []uint8

func (u JSON_key) MarshalJSON() ([]byte, error) {
	var result string
	if u == nil {
		result = "null"
	} else {
		result = "\"" + strings.Join(strings.Fields(fmt.Sprintf("%d", u)), ",") + "\""
	}
	return []byte(result), nil
}

func (result *JSON_key) UnmarshalJSON(b []byte) error {
	int_arr := []int{}
	err := json.Unmarshal(b[1:len(b)-1], &int_arr)
	if err != nil {
		return err
	}
	key := make([]uint8, len(int_arr))
	for i, item := range int_arr {
		key[i] = uint8(item)
	}
	*result = key
	return nil
}

// speichert Zustände der Berechnung
type ComputationMaps struct {
	ClientIds   map[string][]string            // { computation_id -> [ party1_id, party2_id, ...] } for only registered/initialized clients
	SpareIds    map[string][]bool              // { computation_id -> <interval object> }
	MaxCount    map[string]int                 // { computation_id -> <max number of parties allowed> }
	Keys        map[string]map[string]JSON_key // { computation_id -> { party_id -> <public_key> } }
	SecretKeys  map[string]JSON_key            // { computation_id -> <privateKey> }
	FreeParties map[string]map[string]bool     // { computation_id -> { id of every free party -> true } }
}

func NewComputationMaps() *ComputationMaps {
	computationMaps := new(ComputationMaps)
	computationMaps.ClientIds = make(map[string][]string)
	computationMaps.SpareIds = make(map[string][]bool)
	computationMaps.MaxCount = make(map[string]int)
	computationMaps.Keys = make(map[string]map[string]JSON_key)
	computationMaps.SecretKeys = make(map[string]JSON_key)
	computationMaps.FreeParties = make(map[string]map[string]bool)
	return computationMaps
}

type SocketMaps struct {
	SocketId      map[string]map[string]*websocket.Conn
	ComputationId map[*websocket.Conn]string
	PartyId       map[*websocket.Conn]string
}

func NewSocketMaps() *SocketMaps {
	socketMaps := new(SocketMaps)
	socketMaps.SocketId = make(map[string]map[string]*websocket.Conn)
	socketMaps.ComputationId = make(map[*websocket.Conn]string)
	socketMaps.PartyId = make(map[*websocket.Conn]string)
	return socketMaps
}

type InputMessage struct {
	SocketProtocol string
	Data           string
}

type InputMessageDataInitialization struct {
	Computation_id string
	Party_count    int
	Public_key     JSON_key
}

type OutputMessage struct {
	SocketProtocol string `json:"socketProtocol"`
	Data           string `json:"data"`
}

type InnerOutputMessageError struct {
	ErrorProtocol string
	Error         string
}

type InitializePartyMsg struct {
	Party_id    string              `json:"party_id"`
	Party_count int                 `json:"party_count"`
	Public_keys map[string]JSON_key `json:"public_keys"`
}

func NewInitializePartyMsg(party_id string, party_count int, public_keys map[string]JSON_key) *InitializePartyMsg {
	initializePartyMsg := new(InitializePartyMsg)
	initializePartyMsg.Party_id = party_id
	initializePartyMsg.Party_count = party_count
	initializePartyMsg.Public_keys = public_keys
	return initializePartyMsg
}

type InnerCryptoMap struct {
	Shares []string
	Values []string
}

type KeymapToSend struct {
	Public_keys map[string]JSON_key `json:"public_keys"`
}

func NewKeymapToSend() *KeymapToSend {
	keymapToSend := new(KeymapToSend)
	keymapToSend.Public_keys = make(map[string]JSON_key)
	return keymapToSend
}

var upgrader = websocket.Upgrader{}
var computationMaps = NewComputationMaps()
var socketMaps = NewSocketMaps()
var mailbox = make(map[string]map[string][]string)                    // { computation_id -> { party_id -> linked_list<[ message1, message2, ... ]> } }
var cryptoMap = make(map[string]map[string]map[string]InnerCryptoMap) // { computation_id -> { op_id -> { party_id -> { 'shares': [ numeric shares for this party ], 'values': <any non-secret value(s) for this party> } } } }
var party_id_counter int = 1

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
		log.Fatal("party_id \"" + party_id + "\" ist keine Ganzzahl")
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

func initComputation(computation_id string, party_id string, party_count int) {
	if computationMaps.ClientIds[computation_id] == nil {
		computationMaps.ClientIds[computation_id] = make([]string, party_count)
		computationMaps.MaxCount[computation_id] = party_count
		computationMaps.FreeParties[computation_id] = make(map[string]bool)
		computationMaps.Keys[computation_id] = make(map[string]JSON_key)
		socketMaps.SocketId[computation_id] = make(map[string]*websocket.Conn)
		mailbox[computation_id] = make(map[string][]string)
		cryptoMap[computation_id] = make(map[string]map[string]InnerCryptoMap)
	}

	if !(contains(computationMaps.ClientIds[computation_id], party_id)) {
		computationMaps.ClientIds[computation_id] = append(computationMaps.ClientIds[computation_id], party_id)
	}
}

func storeAndSendPublicKey(computation_id string, party_id string, public_key JSON_key) map[string]JSON_key {
	// Öffendlicher Schlüssel speichern
	var tmp = computationMaps.Keys[computation_id]
	if _, ok := tmp["s1"]; !ok { // Public/Private Schlüsselpaar generieren falls diese noch nicht existieren
		var genkey = axlsign.GenerateKeyPair(GenerateRandomBytes(32)) // Generieren des Schlüsselpaars
		computationMaps.SecretKeys[computation_id] = genkey.PrivateKey
		tmp["s1"] = genkey.PublicKey
	}

	if party_id != "s1" {
		tmp[party_id] = public_key
	}

	// Sammeln und formatieren der Schlüssel
	var keymap_to_send = NewKeymapToSend()
	for key := range tmp {
		if val, ok := computationMaps.Keys[computation_id][key]; ok {
			keymap_to_send.Public_keys[key] = val
		} else {
			log.Fatal("Fehler beim generieren des Schlüsselpaars")
		}
	}
	var broadcast_message = toJSON(keymap_to_send)

	// Öffentlicher Schlüssel an alle zuvor verbundenen Parteien ausser der Partei welche dieses Update verursacht hat senden
	for _, party := range computationMaps.ClientIds[computation_id] {
		if party != party_id {
			mailbox[computation_id][party] = append(mailbox[computation_id][party], broadcast_message)
		}
	}

	return keymap_to_send.Public_keys
}

// Initialisierung einer Partei. Rückgabe: Initialisierungsnachricht mit der Partei-ID oder eine Fehlermeldung
func initializeParty(computation_id string, party_id string, public_key JSON_key, party_count int, _s1 bool) (bool, *InitializePartyMsg) {

	log.Println("Server inizialisiert mit ", computation_id, "-", party_id, " #", party_count, "::", _s1)

	if !_s1 && party_id == "s1" {
		log.Fatal("party_id s1 ist für den Server reserviert und darf nicht von einem Client verwendet werden!")
	}

	// Liste aller noch verfügbaren Partei erstellen
	if computationMaps.SpareIds[computation_id] == nil {
		computationMaps.SpareIds[computation_id] = make([]bool, party_count)
	}

	if party_id != "" {
		if party_id != "s1" && computationMaps.SpareIds[computation_id][getPartyIdInt(party_id)-1] {
			log.Fatal("party_id existiert schon")
		}
	} else { // generate einer freien party_id
		var currentSpareIds = computationMaps.SpareIds[computation_id]
		for i := range currentSpareIds {
			if !currentSpareIds[i] {
				party_id = fmt.Sprint(i)
				break
			}
		}
	}

	if party_id != "s1" {
		computationMaps.SpareIds[computation_id][getPartyIdInt(party_id)-1] = true
	}

	// Initialisierung der Berechnung und definieren aller noch undefinierten Objekten.
	initComputation(computation_id, party_id, party_count)

	// Initialisierungsnachricht für den Client erstellen
	keymap_to_send := storeAndSendPublicKey(computation_id, party_id, public_key)

	var message = NewInitializePartyMsg(party_id, party_count, keymap_to_send)
	return true, message
}

func initialization(data string, party_id string, socket *websocket.Conn) {

	var inputData = &InputMessageDataInitialization{}
	toObj([]byte(data), inputData)
	success, message := initializeParty(inputData.Computation_id, party_id, inputData.Public_key, inputData.Party_count, false)

	if socketMaps.SocketId[inputData.Computation_id] == nil {
		socketMaps.SocketId[inputData.Computation_id] = make(map[string]*websocket.Conn)
	}

	for party_id_of_mailbox := range mailbox[inputData.Computation_id] {
		for _, mail := range mailbox[inputData.Computation_id][party_id_of_mailbox] {
			if socketMaps.SocketId[inputData.Computation_id][party_id_of_mailbox] != nil {
				outputMessageObj := &OutputMessage{
					SocketProtocol: "public_keys",
					Data:           mail,
				}
				socketMaps.SocketId[inputData.Computation_id][party_id_of_mailbox].WriteJSON(outputMessageObj)
				log.Printf("Sent: %s", toJSON(outputMessageObj))
			}
		}
	}

	if success {
		socketMaps.SocketId[inputData.Computation_id][message.Party_id] = socket
		socketMaps.ComputationId[socket] = inputData.Computation_id
		socketMaps.PartyId[socket] = message.Party_id
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

		log.Print(inputMessage)

		switch socketProtocol := inputMessage.SocketProtocol; socketProtocol {
		case "initialization":
			fmt.Println("initialization")
			party_id := strconv.Itoa(party_id_counter)
			party_id_counter++
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
	log.Fatal(http.ListenAndServe(":8080", nil))
}
