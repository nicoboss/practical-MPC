package CryptoProvider

import (
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/crypto"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"log"

	"github.com/gorilla/websocket"
)

func HandleCryptoProvider(data string, socket *websocket.Conn) {

	computation_id := storage.SocketMaps.ComputationId[socket]
	from_party_id := storage.SocketMaps.PartyId[socket]

	var message = &InputMessageCryptoProvider{}
	JSON.ToObj([]byte(data), message)

	label := message.Label
	params := message.Params
	op_id := message.Op_id
	receivers_list := message.Receivers
	threshold := message.Threshold
	Zp := message.Zp

	// Fals nicht schon gespeichert muss berechnet werden
	result, ok := storage.CryptoMap[computation_id][op_id]
	if !ok {
		var secrets []int
		switch label {
		case "triplet":
			secrets = CryptoProviderHandlersTriplet(Zp, params)
		case "numbers":
			secrets = CryptoProviderHandlersNumbers(Zp, params)
		default:
			log.Fatalln("Nur CryptoProviderHandlers für " + label + " ist nicht implementiert!")
		}

		var shares = make(map[int][]int)
		if len(secrets) != 0 {
			for i := 0; i < len(receivers_list); i++ {
				shares[receivers_list[i]] = []int{}
			}
			for i := 0; i < len(secrets); i++ {
				var oneShare = crypto.ComputeShares(secrets[i], receivers_list, threshold, Zp)
				for j := 0; j < len(receivers_list); j++ {
					shares[receivers_list[j]] = append(shares[receivers_list[j]], oneShare[receivers_list[j]])
				}
			}
		}
		result.Values = secrets
		result.Shares = shares
		storage.CryptoMap[computation_id][op_id] = result
	}

	outputMessageCryptoProvider := &OutputMessageCryptoProvider{
		Op_id:     op_id,
		Receivers: receivers_list,
		Threshold: threshold,
		Zp:        Zp,
		Shares:    result.Shares[from_party_id],
	}

	mailbox.Append(computation_id, from_party_id, "crypto_provider", JSON.ToJSON(outputMessageCryptoProvider))
	mailbox.SendMails(computation_id)

}
