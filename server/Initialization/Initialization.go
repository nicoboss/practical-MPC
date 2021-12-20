package Initialization

import (
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"log"

	"github.com/gorilla/websocket"
)

func Register(inputMessageData string, inputMessage string, socket *websocket.Conn) (int, bool) {
	var inputData = &InputMessageDataInitialization{}
	JSON.ToObj([]byte(inputMessageData), inputData)

	var party_id int
	if storage.ComputationMaps.ClientIds[inputData.Computation_id] != nil {
		if storage.Party_id_counter[inputData.Computation_id] > inputData.Party_count {
			log.Printf("[RECEIVED][%s]: %s", "initialization", inputMessageData)
			mailbox.SendReceivedToLoggers(inputMessage, 0)
			mailbox.BroadcastError("Serverreset: Anzahl Teilnehmer überschreitet Eingabe von Partei", socket)
			storage.ResetStorage()
			return 0, false
		}
		if storage.ComputationMaps.MaxCount[inputData.Computation_id] != inputData.Party_count {
			log.Printf("[RECEIVED][%s]: %s", "initialization", inputMessageData)
			mailbox.SendReceivedToLoggers(inputMessage, 0)
			mailbox.BroadcastError("Serverreset: Anzahl Teilnehmer verschieden zwischen Parteien", socket)
			storage.ResetStorage()
			return 0, false
		}
		if storage.Party_id_counter[inputData.Computation_id] > storage.ComputationMaps.MaxCount[inputData.Computation_id] {
			log.Printf("[RECEIVED][%s]: %s", "initialization", inputMessageData)
			mailbox.SendReceivedToLoggers(inputMessage, 0)
			mailbox.BroadcastError("Serverreset: Anzahl Teilnehmer überschritten", socket)
			storage.ResetStorage()
			return 0, false
		}
	}

	// Initialisierung der Berechnung und definieren aller noch undefinierten Objekten
	party_id = storage.InitComputation(inputData.Computation_id, inputData.Party_count)

	// Initialisierung der Mailbox
	mailbox.Init(inputData.Computation_id)

	return party_id, true
}

func Initialization(data string, party_id int, socket *websocket.Conn) {

	var inputData = &InputMessageDataInitialization{}
	JSON.ToObj([]byte(data), inputData)
	success, message := initializeParty(inputData.Computation_id, party_id, inputData.Public_key, inputData.Party_count, false)

	if storage.SocketMaps.SocketId[inputData.Computation_id] == nil {
		storage.SocketMaps.SocketId[inputData.Computation_id] = make(map[int]*websocket.Conn)
	}

	mailbox.SendMails(inputData.Computation_id)

	if success {
		storage.SocketMaps.SocketId[inputData.Computation_id][message.Party_id] = socket
		storage.SocketMaps.ComputationId[socket] = inputData.Computation_id
		storage.SocketMaps.PartyId[socket] = message.Party_id
		mailbox.Append(inputData.Computation_id, party_id, "initialization", JSON.ToJSON(message))
		mailbox.SendMails(inputData.Computation_id)
	} else {
		innerOutputMessageErrorObj := &InnerOutputMessageError{ErrorProtocol: "initialization", Error: JSON.ToJSON(message)}
		mailbox.Append(inputData.Computation_id, party_id, "error", JSON.ToJSON(innerOutputMessageErrorObj))
		mailbox.SendMails(inputData.Computation_id)
	}
}
