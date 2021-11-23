package protocol

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"PracticalMPC/Server/structs"
	"log"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
)

func HandleOpen(data string, socket *websocket.Conn) {
	computation_id := storage.SocketMaps.ComputationId[socket]
	from_party_id, err := strconv.Atoi(storage.SocketMaps.PartyId[socket])
	if err != nil {
		log.Fatalln("from_party_id ist kein integer")
	}

	var outputMessageObj = new(structs.OutputMessage)
	outputMessageObj.SocketProtocol = "open"

	var to_party_id int
	if strings.Contains(data, "nonce") && strings.Contains(data, "cipher") {
		var localMessage = &structs.MessageDataOpen{}
		conversions.ToObj([]byte(data), localMessage)
		to_party_id = localMessage.Party_id
		localMessage.Party_id = from_party_id
		outputMessageObj.Data = conversions.ToJSON(localMessage)
	} else {
		var localMessage = &structs.MessageDataInsecureOpen{}
		conversions.ToObj([]byte(data), localMessage)
		to_party_id = localMessage.Party_id
		localMessage.Party_id = from_party_id
		outputMessageObj.Data = conversions.ToJSON(localMessage)

	}

	mailbox.Append(computation_id, strconv.Itoa(to_party_id), outputMessageObj)
	mailbox.SendMails(computation_id)
}
