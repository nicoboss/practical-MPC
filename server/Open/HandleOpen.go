package Open

import (
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
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

	var to_party_id int
	if strings.Contains(data, "nonce") && strings.Contains(data, "cipher") {
		var localMessage = &MessageDataOpen{}
		JSON.ToObj([]byte(data), localMessage)
		to_party_id = localMessage.Party_id
		localMessage.Party_id = from_party_id
		mailbox.Append(computation_id, strconv.Itoa(to_party_id), "open", JSON.ToJSON(localMessage))
	} else {
		var localMessage = &MessageDataInsecureOpen{}
		JSON.ToObj([]byte(data), localMessage)
		to_party_id = localMessage.Party_id
		localMessage.Party_id = from_party_id
		mailbox.Append(computation_id, strconv.Itoa(to_party_id), "open", JSON.ToJSON(localMessage))
	}

	mailbox.SendMails(computation_id)
}