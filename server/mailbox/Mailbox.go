package mailbox

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/structs"
	"log"
)

var mailbox = make(map[string]map[string][]string) // { computation_id -> { party_id -> linked_list<[ message1, message2, ... ]> } }

func Init(computation_id string) {
	mailbox[computation_id] = make(map[string][]string)
}

func Append(computation_id string, party_id string, broadcast_message string) {
	mailbox[computation_id][party_id] = append(mailbox[computation_id][party_id], broadcast_message)
}

func SendMails(socketMaps *structs.SocketMaps, computation_id string) {
	for party_id_of_mailbox := range mailbox[computation_id] {
		for _, mail := range mailbox[computation_id][party_id_of_mailbox] {
			if socketMaps.SocketId[computation_id][party_id_of_mailbox] != nil {
				outputMessageObj := &structs.OutputMessage{
					SocketProtocol: "public_keys",
					Data:           mail,
				}
				socketMaps.SocketId[computation_id][party_id_of_mailbox].WriteJSON(outputMessageObj)
				log.Printf("Sent: %s", conversions.ToJSON(outputMessageObj))
			}
		}
	}

}
