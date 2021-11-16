package protocol

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"PracticalMPC/Server/structs"
	"log"
	"strconv"

	"github.com/gorilla/websocket"
)

func Initialization(data string, party_id string, socket *websocket.Conn) {

	var inputData = &structs.InputMessageDataInitialization{}
	conversions.ToObj([]byte(data), inputData)
	success, message := initializeParty(inputData.Computation_id, party_id, inputData.Public_key, inputData.Party_count, false)

	if storage.SocketMaps.SocketId[inputData.Computation_id] == nil {
		storage.SocketMaps.SocketId[inputData.Computation_id] = make(map[string]*websocket.Conn)
	}

	mailbox.SendMails(storage.SocketMaps, inputData.Computation_id)

	if success {
		storage.SocketMaps.SocketId[inputData.Computation_id][strconv.Itoa(message.Party_id)] = socket
		storage.SocketMaps.ComputationId[socket] = inputData.Computation_id
		storage.SocketMaps.PartyId[socket] = strconv.Itoa(message.Party_id)
		outputMessageObj := &structs.OutputMessage{
			SocketProtocol: "initialization",
			Data:           conversions.ToJSON(message),
		}
		socket.WriteJSON(outputMessageObj)
		log.Printf("Sent: %s", conversions.ToJSON(outputMessageObj))
	} else {
		innerOutputMessageErrorObj := &structs.InnerOutputMessageError{ErrorProtocol: "initialization", Error: conversions.ToJSON(message)}
		outputMessageObj := &structs.OutputMessage{SocketProtocol: "error", Data: conversions.ToJSON(innerOutputMessageErrorObj)}
		socket.WriteJSON(outputMessageObj)
		log.Printf("Sent: %s", conversions.ToJSON(outputMessageObj))
	}
}
