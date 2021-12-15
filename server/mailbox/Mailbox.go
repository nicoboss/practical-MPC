package mailbox

import (
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/storage"
	"log"

	"github.com/gorilla/websocket"
)

var mailbox = make(map[string]map[string][]*OutputMessage) // { computation_id -> { party_id -> linked_list<[ message1, message2, ... ]> } }

func Init(computation_id string) {
	mailbox[computation_id] = make(map[string][]*OutputMessage)
}

func Append(computation_id string, party_id string, socketProtocol string, data string) {
	message := &OutputMessage{
		SocketProtocol: socketProtocol,
		Data:           data,
	}
	mailbox[computation_id][party_id] = append(mailbox[computation_id][party_id], message)
}

func SendMails(computation_id string) {
	for party_id_of_mailbox := range mailbox[computation_id] {
		if storage.SocketMaps.SocketId[computation_id][party_id_of_mailbox] != nil {
			for _, mail := range mailbox[computation_id][party_id_of_mailbox] {
				storage.SocketMaps.SocketId[computation_id][party_id_of_mailbox].WriteJSON(*mail)
				log.Printf("[SENT][%s][%s]: %s", party_id_of_mailbox, mail.SocketProtocol, mail.Data)
				SendSentToLoggers(JSON.ToJSON(mail), party_id_of_mailbox)
			}
			mailbox[computation_id][party_id_of_mailbox] = nil
		}
	}
}

func BroadcastError(errorMsg string, socket *websocket.Conn) {
	log.Printf("[BroadcastError]: %s", errorMsg)
	SendServerToLoggers(errorMsg)
	if socket != nil {
		message := &OutputMessage{
			SocketProtocol: "error",
			Data:           errorMsg,
		}
		socket.WriteJSON(message)
	}
	for computation_id := range mailbox {
		for party_id_of_mailbox := range mailbox[computation_id] {
			Append(computation_id, party_id_of_mailbox, "error", errorMsg)
		}
		SendMails(computation_id)
	}
}

func SendReceivedToLoggers(message string, sender_party_id string) {
	inputMessagesLoggerObj := &InputMessagesLogger{
		LoggerProtocol:  "ClientToServer",
		Sender_party_id: sender_party_id,
		Message:         message,
	}
	for logger, _ := range storage.Loggers {
		logger.WriteJSON(*inputMessagesLoggerObj)
	}
}

func SendSentToLoggers(message string, reciever_party_id string) {
	outputMessagesLoggerObj := &OutputMessageLogger{
		LoggerProtocol:    "ServerToClient",
		Reciever_party_id: reciever_party_id,
		Message:           message,
	}
	for logger, _ := range storage.Loggers {
		logger.WriteJSON(*outputMessagesLoggerObj)
	}
}

func SendServerToLoggers(message string) {
	serverMessageLoggerObj := &ServerMessageLogger{
		LoggerProtocol: "ServerToLogger",
		Message:        message,
	}
	log.Printf("[LOG]: %s", message)
	for logger, _ := range storage.Loggers {
		logger.WriteJSON(*serverMessageLoggerObj)
	}
}
