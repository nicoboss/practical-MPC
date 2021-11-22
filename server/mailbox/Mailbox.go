package mailbox

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/storage"
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

func SendMails(computation_id string) {
	for party_id_of_mailbox := range mailbox[computation_id] {
		if storage.SocketMaps.SocketId[computation_id][party_id_of_mailbox] != nil {
			for _, mail := range mailbox[computation_id][party_id_of_mailbox] {
				storage.SocketMaps.SocketId[computation_id][party_id_of_mailbox].WriteJSON(*mail)
				log.Printf("[SENT][%s][%s]: %s", party_id_of_mailbox, mail.SocketProtocol, mail.Data)
				SendSentToLoggers(mail, party_id_of_mailbox)
			}
			mailbox[computation_id][party_id_of_mailbox] = nil
		}
	}
}

func SendReceivedToLoggers(message *structs.InputMessage, sender_party_id string) {
	inputMessagesLoggerObj := &structs.InputMessagesLogger{
		LoggerProtocol:  "ClientToServer",
		Sender_party_id: sender_party_id,
		Message:         conversions.ToJSON(message),
	}
	for logger, _ := range storage.Loggers {
		logger.WriteJSON(*inputMessagesLoggerObj)
	}
}

func SendSentToLoggers(message *structs.OutputMessage, reciever_party_id string) {
	outputMessagesLoggerObj := &structs.OutputMessageLogger{
		LoggerProtocol:    "ServerToClient",
		Reciever_party_id: reciever_party_id,
		Message:           conversions.ToJSON(message),
	}
	for logger, _ := range storage.Loggers {
		logger.WriteJSON(*outputMessagesLoggerObj)
	}
}
