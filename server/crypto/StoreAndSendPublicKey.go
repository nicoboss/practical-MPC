package crypto

import (
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"log"
	"strconv"

	"github.com/miguelsandro/curve25519-go/axlsign"
)

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

func StoreAndSendPublicKey(computationMaps *storage.ComputationMapsStruct, computation_id string, party_id int, public_key JSON.Key) map[string]JSON.Key {
	// Öffendlicher Schlüssel speichern
	var tmp = computationMaps.Keys[computation_id]

	if len(public_key) == 0 {
		tmp[-1] = JSON.Key{}
	} else if _, ok := tmp[-1]; !ok { // Public/Private Schlüsselpaar generieren falls diese noch nicht existieren
		var genkey = axlsign.GenerateKeyPair(generateRandomBytes(32)) // Generieren des Schlüsselpaars
		computationMaps.SecretKeys[computation_id] = genkey.PrivateKey
		tmp[-1] = genkey.PublicKey
	}

	if party_id > 0 {
		tmp[party_id] = public_key
	}

	// Sammeln und formatieren der Schlüssel
	var keymap_to_send = NewKeymapToSend()
	for key := range tmp {
		if val, ok := computationMaps.Keys[computation_id][key]; ok {

			keymap_to_send.Public_keys[get_party_id_string(key)] = val
		} else {
			log.Fatal("Fehler beim generieren des Schlüsselpaars")
		}
	}
	var broadcast_message = JSON.ToJSON(keymap_to_send)

	// Öffentlicher Schlüssel an alle zuvor verbundenen Parteien ausser der Partei welche dieses Update verursacht hat senden
	for _, party := range computationMaps.ClientIds[computation_id] {
		if party != party_id {
			mailbox.Append(computation_id, party, "public_keys", broadcast_message)
		}
	}

	return keymap_to_send.Public_keys
}
