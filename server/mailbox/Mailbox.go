package mailbox

import (
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/storage"
	"log"
	"strconv"

	"github.com/gorilla/websocket"
)

var mailbox = make(map[string]map[int][]*OutputMessage) // { computation_id -> { party_id -> linked_list<[ message1, message2, ... ]> } }
var logCache = make([]interface{}, 0, 10000)            // Mögliche Typen: InputMessagesLogger, OutputMessageLogger, ServerMessageLogger

func Init(computation_id string) {
	mailbox[computation_id] = make(map[int][]*OutputMessage)
}

func Append(computation_id string, party_id int, socketProtocol string, data string) {
	message := &OutputMessage{
		SocketProtocol: socketProtocol,
		Data:           data,
	}
	mailbox[computation_id][party_id] = append(mailbox[computation_id][party_id], message)
}

func get_party_id_string(party_id int) string {
	if party_id < -1 {
		return ""
	}
	switch party_id {
	case -1:
		return "s1"
	case 0:
		return ""
	default:
		return strconv.Itoa(party_id)
	}
}

func SendMails(computation_id string) {
	for party_id_of_mailbox := range mailbox[computation_id] {
		if storage.SocketMaps.SocketId[computation_id][party_id_of_mailbox] != nil {
			for _, mail := range mailbox[computation_id][party_id_of_mailbox] {
				storage.SocketMaps.SocketId[computation_id][party_id_of_mailbox].WriteJSON(*mail)
				var party_id_of_mailbox_string string
				switch party_id_of_mailbox {
				case -1:
					party_id_of_mailbox_string = "s1"
				case 0:
					party_id_of_mailbox_string = ""
				default:
					party_id_of_mailbox_string = get_party_id_string(party_id_of_mailbox)
				}
				//log.Printf("[SENT][%s][%s]: %s", party_id_of_mailbox_string, mail.SocketProtocol, mail.Data)
				SendSentToLoggers(JSON.ToJSON(mail), party_id_of_mailbox_string)
			}
			mailbox[computation_id][party_id_of_mailbox] = nil
		}
	}
}

func BroadcastReset(errorMsg string, socket *websocket.Conn) {
	log.Printf("[BroadcastError]: %s\n", errorMsg)
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
	// ResetStorage der Mailbox
	mailbox = make(map[string]map[int][]*OutputMessage)
	logCache = make([]interface{}, 0, 10000)
}

func SendReceivedToLoggers(message string, sender_party_id int) {
	inputMessagesLoggerObj := &InputMessagesLogger{
		LoggerProtocol:  "ClientToServer",
		Sender_party_id: get_party_id_string(sender_party_id),
		Message:         message,
	}
	logCache = append(logCache, *inputMessagesLoggerObj)
	for logger := range storage.Loggers {
		logger.WriteJSON(*inputMessagesLoggerObj)
	}
}

func SendSentToLoggers(message string, reciever_party_id string) {
	outputMessagesLoggerObj := &OutputMessageLogger{
		LoggerProtocol:    "ServerToClient",
		Reciever_party_id: reciever_party_id,
		Message:           message,
	}
	logCache = append(logCache, *outputMessagesLoggerObj)
	for logger := range storage.Loggers {
		logger.WriteJSON(*outputMessagesLoggerObj)
	}
}

func SendServerToLoggers(message string) {
	serverMessageLoggerObj := &ServerMessageLogger{
		LoggerProtocol: "ServerToLogger",
		Message:        message,
	}
	//log.Printf("[LOG]: %s\n", message)
	logCache = append(logCache, *serverMessageLoggerObj)
	for logger := range storage.Loggers {
		logger.WriteJSON(*serverMessageLoggerObj)
	}
}

func SendCacheToLogger(logger *websocket.Conn) {
	for _, cacheEntry := range logCache {
		logger.WriteJSON(cacheEntry)
	}
}
