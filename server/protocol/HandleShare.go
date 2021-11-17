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
	log.Printf("Weiterleiten von Share von %d => %d", from_party_id, to_party_id)

	var outputMessageObj = new(structs.OutputMessage)
	outputMessageObj.SocketProtocol = "share"
	outputMessageObj.Data = conversions.ToJSON(message)

	mailbox.Append(computation_id, strconv.Itoa(to_party_id), outputMessageObj)
	mailbox.SendMails(storage.SocketMaps, computation_id)
}
