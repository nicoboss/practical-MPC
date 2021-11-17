package protocol

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/crypto"
	"PracticalMPC/Server/storage"
	"PracticalMPC/Server/structs"
	"log"
	"strconv"

	"github.com/gorilla/websocket"
)

func HandleCryptoProvider(data string, socket *websocket.Conn) {

	computation_id := storage.SocketMaps.ComputationId[socket]
	from_party_id, err := strconv.Atoi(storage.SocketMaps.PartyId[socket])

	if err != nil {
		log.Fatalln("from_party_id ist kein integer")
	}
	var message = &structs.InputMessageCryptoProvider{}
	conversions.ToObj([]byte(data), message)

	label := message.Label
	params := message.Params
	op_id := message.Op_id
	receivers_list := message.Receivers
	threshold := message.Threshold
	Zp := message.Zp

	if label != "numbers" {
		log.Fatalln("Nur CryptoProviderHandlersNumbers ist momentan implementiert!")
	}

	// Fals nicht schon gespeichert muss berechnet werden
	result, ok := storage.CryptoMap[computation_id][op_id]
	if ok {
		var secrets = crypto.CryptoProviderHandlersNumbers(Zp, params)
		var shares = make(map[int][]int)
		if len(secrets) != 0 {
			for i := 0; i < len(receivers_list); i++ {
				shares[receivers_list[i]] = make([]int, len(receivers_list))
			}
			for i := 0; i < len(secrets); i++ {
				var oneShare = make([]int, len(receivers_list)) //jiffServer.hooks.computeShares(jiffServer, secrets[i], receivers_list, threshold, Zp);
				log.Fatalln("computeShares noch nicht implementiert!")
				for j := 0; j < len(receivers_list); j++ {
					shares[receivers_list[j]][j] = oneShare[receivers_list[j]]
				}
			}
		}
		result := &structs.InnerCryptoMap{
			Values: secrets,
			Shares: shares,
		}
		storage.CryptoMap[computation_id][op_id] = *result
	}

	outputMessageCryptoProvider := &structs.OutputMessageCryptoProvider{
		Op_id:     op_id,
		Receivers: receivers_list,
		Threshold: threshold,
		Zp:        Zp,
		Values:    result.Values,
		Shares:    result.Shares[from_party_id],
	}

	//ToDo: Memory clean-up noch nicht implementiert!
	outputMessageObj := &structs.OutputMessage{
		SocketProtocol: "crypto_provider",
		Data:           conversions.ToJSON(outputMessageCryptoProvider),
	}

	socket.WriteJSON(outputMessageObj)
	log.Printf("Sent: %s", conversions.ToJSON(outputMessageObj))

}
