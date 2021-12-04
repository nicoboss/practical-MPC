package Custom

import (
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"log"
	"strconv"

	"github.com/gorilla/websocket"
)

func HandleCustom(data string, socket *websocket.Conn) {
	computation_id := storage.SocketMaps.ComputationId[socket]
	from_party_id, err := strconv.Atoi(storage.SocketMaps.PartyId[socket])
	if err != nil {
		log.Fatalln("from_party_id ist kein integer")
	}

	var to_party_id int
	var localMessage = &MessageDataCustom{}
	JSON.ToObj([]byte(data), localMessage)
	to_party_id = localMessage.Party_id
	localMessage.Party_id = from_party_id

	mailbox.Append(computation_id, strconv.Itoa(to_party_id), "custom", JSON.ToJSON(localMessage))
	mailbox.SendMails(computation_id)
}
