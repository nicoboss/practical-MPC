package protocol

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/storage"
	"PracticalMPC/Server/structs"
	"log"
	"strconv"

	"github.com/gorilla/websocket"
)

func HandleShare(data string, socket *websocket.Conn) {

	from_party_id, err := strconv.Atoi(storage.SocketMaps.PartyId[socket])
	if err != nil {
		log.Fatalln("from_party_id ist kein integer")
	}
	var message = &structs.MessageDataShare{}
	conversions.ToObj([]byte(data), message)

	var to_party_id = message.Party_id
	message.Party_id = from_party_id
	log.Printf("Weiterleiten von Share von %d => %d", from_party_id, to_party_id)

	outputMessageObj := &structs.OutputMessage{
		SocketProtocol: "share",
		Data:           conversions.ToJSON(message),
	}

	socket.WriteJSON(outputMessageObj)
	log.Printf("Sent: %s", conversions.ToJSON(outputMessageObj))

}
