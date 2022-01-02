package mailbox

import (
	"PracticalMPC/Server/storage"
	"time"

	"github.com/gorilla/websocket"
)

func SendReceivedToLoggers(message string, sender_party_id int) {
	inputMessagesLoggerObj := &InputMessagesLogger{
		LoggerProtocol:  "ClientToServer",
		Time:            time.Now().UnixMilli(),
		Sender_party_id: get_party_id_string(sender_party_id),
		Message:         message,
	}
	addToLogCache(*inputMessagesLoggerObj)
	for logger := range storage.Loggers {
		logger.WriteJSON(*inputMessagesLoggerObj)
	}
}

func SendSentToLoggers(message string, reciever_party_id string) {
	outputMessagesLoggerObj := &OutputMessageLogger{
		LoggerProtocol:    "ServerToClient",
		Time:              time.Now().UnixMilli(),
		Reciever_party_id: reciever_party_id,
		Message:           message,
	}
	addToLogCache(*outputMessagesLoggerObj)
	for logger := range storage.Loggers {
		logger.WriteJSON(*outputMessagesLoggerObj)
	}
}

func SendServerToLoggers(message string) {
	serverMessageLoggerObj := &ServerMessageLogger{
		LoggerProtocol: "ServerToLogger",
		Time:           time.Now().UnixMilli(),
		Message:        message,
	}
	//log.Printf("[LOG]: %s\n", message)
	addToLogCache(*serverMessageLoggerObj)
	for logger := range storage.Loggers {
		logger.WriteJSON(*serverMessageLoggerObj)
	}
}

func SendCacheToLogger(logger *websocket.Conn) {
	i := logCacheTail
	if i < 0 {
		i = 0
	}
	for i != logCacheHead {
		logger.WriteJSON(logCache[i])
		i = (i + 1) % 1000
	}
}
