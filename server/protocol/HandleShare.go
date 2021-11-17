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

func HandleShare(data string, socket *websocket.Conn) {
	computation_id := storage.SocketMaps.ComputationId[socket]
	from_party_id, err := strconv.Atoi(storage.SocketMaps.PartyId[socket])
	if err != nil {
		log.Fatalln("from_party_id ist kein integer")
	}
	var message = &structs.MessageDataShare{}
	conversions.ToObj([]byte(data), message)

	var to_party_id = message.Party_id
	message.Party_id = from_party_id
	log.Printf("Weiterleiten von Share von %s => %s", from_party_id, to_party_id)

	var outputMessageObj = new(structs.OutputMessage)
	outputMessageObj.SocketProtocol = "share"

	mailbox.Append(computation_id, strconv.Itoa(to_party_id), conversions.ToJSON(outputMessageObj))
}