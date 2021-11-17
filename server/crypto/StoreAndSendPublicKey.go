package crypto

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/structs"
	"PracticalMPC/Server/types"
	"log"

	"github.com/miguelsandro/curve25519-go/axlsign"
)

func StoreAndSendPublicKey(computationMaps *structs.ComputationMaps, computation_id string, party_id string, public_key types.JSON_key) map[string]types.JSON_key {
	// Öffendlicher Schlüssel speichern
	var tmp = computationMaps.Keys[computation_id]
	if _, ok := tmp["s1"]; !ok { // Public/Private Schlüsselpaar generieren falls diese noch nicht existieren
		var genkey = axlsign.GenerateKeyPair(generateRandomBytes(32)) // Generieren des Schlüsselpaars
		computationMaps.SecretKeys[computation_id] = genkey.PrivateKey
		tmp["s1"] = genkey.PublicKey
	}

	if party_id != "s1" {
		tmp[party_id] = public_key
	}

	// Sammeln und formatieren der Schlüssel
	var keymap_to_send = structs.NewKeymapToSend()
	for key := range tmp {
		if val, ok := computationMaps.Keys[computation_id][key]; ok {
			keymap_to_send.Public_keys[key] = val
		} else {
			log.Fatal("Fehler beim generieren des Schlüsselpaars")
		}
	}
	var broadcast_message = conversions.ToJSON(keymap_to_send)

	// Öffentlicher Schlüssel an alle zuvor verbundenen Parteien ausser der Partei welche dieses Update verursacht hat senden
	for _, party := range computationMaps.ClientIds[computation_id] {
		if party != party_id {
			outputMessageObj := &structs.OutputMessage{
				SocketProtocol: "public_keys",
				Data:           broadcast_message,
			}
			mailbox.Append(computation_id, party, outputMessageObj)
		}
	}

	return keymap_to_send.Public_keys
}
