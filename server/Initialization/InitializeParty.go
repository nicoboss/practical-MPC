package Initialization

import (
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/crypto"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"log"
)

// Initialisierung einer Partei. Rückgabe: Initialisierungsnachricht mit der Partei-ID oder eine Fehlermeldung
func initializeParty(computation_id string, party_id int, public_key JSON.Key, party_count int, _s1 bool) (bool, *InitializePartyMsg) {

	// Neue Berechnung
	if storage.ComputationMaps.SpareIds[computation_id] == nil {
		// Liste aller noch verfügbaren Partei erstellen
		log.Printf("Neue Berechnung: %s\n", computation_id)
		storage.ComputationMaps.SpareIds[computation_id] = make([]bool, party_count)
		mailbox.ClearLogCache()
	}

	if party_id != 0 {
		if party_id > 0 && storage.ComputationMaps.SpareIds[computation_id][party_id-1] {
			log.Fatalln("party_id existiert schon")
		}
	} else { // generate einer freien party_id
		var currentSpareIds = storage.ComputationMaps.SpareIds[computation_id]
		for i := range currentSpareIds {
			if !currentSpareIds[i] {
				party_id = i
				break
			}
		}
	}

	if party_id > 0 {
		storage.ComputationMaps.SpareIds[computation_id][party_id-1] = true
	}

	// Initialisierungsnachricht für den Client erstellen
	keymap_to_send := crypto.StoreAndSendPublicKey(storage.ComputationMaps, computation_id, party_id, public_key)

	var message = NewInitializePartyMsg(party_id, party_count, keymap_to_send)
	return true, message
}
