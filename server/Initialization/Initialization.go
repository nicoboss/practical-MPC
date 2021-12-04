package Initialization

import (
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"strconv"

	"github.com/gorilla/websocket"
)

func Register(inputMessageData string) string {
	var inputData = &InputMessageDataInitialization{}
	JSON.ToObj([]byte(inputMessageData), inputData)

	// Initialisierung der Berechnung und definieren aller noch undefinierten Objekten
	var party_id string
	party_id = strconv.Itoa(storage.InitComputation(inputData.Computation_id, inputData.Party_count))

	// Initialisierung der Mailbox
	mailbox.Init(inputData.Computation_id)

	return party_id
}

func Initialization(data string, party_id string, socket *websocket.Conn) {

	var inputData = &InputMessageDataInitialization{}
	JSON.ToObj([]byte(data), inputData)
	success, message := initializeParty(inputData.Computation_id, party_id, inputData.Public_key, inputData.Party_count, false)

	if storage.SocketMaps.SocketId[inputData.Computation_id] == nil {
		storage.SocketMaps.SocketId[inputData.Computation_id] = make(map[string]*websocket.Conn)
	}

	mailbox.SendMails(inputData.Computation_id)

	if success {
		storage.SocketMaps.SocketId[inputData.Computation_id][strconv.Itoa(message.Party_id)] = socket
		storage.SocketMaps.ComputationId[socket] = inputData.Computation_id
		storage.SocketMaps.PartyId[socket] = strconv.Itoa(message.Party_id)
		mailbox.Append(inputData.Computation_id, party_id, "initialization", JSON.ToJSON(message))
		mailbox.SendMails(inputData.Computation_id)
	} else {
		innerOutputMessageErrorObj := &InnerOutputMessageError{ErrorProtocol: "initialization", Error: JSON.ToJSON(message)}
		mailbox.Append(inputData.Computation_id, party_id, "error", JSON.ToJSON(innerOutputMessageErrorObj))
		mailbox.SendMails(inputData.Computation_id)
	}
}
