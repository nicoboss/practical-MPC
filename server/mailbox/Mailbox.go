package mailbox

import (
	"PracticalMPC/Server/structs"
	"log"
)

var mailbox = make(map[string]map[string][]*structs.OutputMessage) // { computation_id -> { party_id -> linked_list<[ message1, message2, ... ]> } }

func Init(computation_id string) {
	mailbox[computation_id] = make(map[string][]*structs.OutputMessage)
}

func Append(computation_id string, party_id string, message *structs.OutputMessage) {
	mailbox[computation_id][party_id] = append(mailbox[computation_id][party_id], message)
}

func reverse(lst []*structs.OutputMessage) chan *structs.OutputMessage {
	ret := make(chan *structs.OutputMessage)
	go func() {
		for i, _ := range lst {
			ret <- lst[len(lst)-1-i]
		}
		close(ret)
	}()
	return ret
}

func SendMails(socketMaps *structs.SocketMaps, computation_id string) {
	for party_id_of_mailbox := range mailbox[computation_id] {
		if socketMaps.SocketId[computation_id][party_id_of_mailbox] != nil {
			for mail := range reverse(mailbox[computation_id][party_id_of_mailbox]) {
				socketMaps.SocketId[computation_id][party_id_of_mailbox].WriteJSON(*mail)
				log.Printf("[SENT][%s][%s]: %s", party_id_of_mailbox, mail.SocketProtocol, mail.Data)
			}
			mailbox[computation_id][party_id_of_mailbox] = nil
		}
	}

}
