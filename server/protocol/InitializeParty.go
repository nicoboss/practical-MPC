package protocol

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/crypto"
	"PracticalMPC/Server/mailbox"
	"PracticalMPC/Server/storage"
	"PracticalMPC/Server/structs"
	"PracticalMPC/Server/types"
	"fmt"
	"log"
	"strconv"
)

// Initialisierung einer Partei. Rückgabe: Initialisierungsnachricht mit der Partei-ID oder eine Fehlermeldung
func initializeParty(computation_id string, party_id string, public_key types.JSON_key, party_count int, _s1 bool) (bool, *structs.InitializePartyMsg) {

	if !_s1 && party_id == "s1" {
		log.Fatal("party_id s1 ist für den Server reserviert und darf nicht von einem Client verwendet werden!")
	}

	// Liste aller noch verfügbaren Partei erstellen
	if storage.ComputationMaps.SpareIds[computation_id] == nil {
		storage.ComputationMaps.SpareIds[computation_id] = make([]bool, party_count)
	}

	if party_id != "" {
		if party_id != "s1" && storage.ComputationMaps.SpareIds[computation_id][conversions.GetPartyIdInt(party_id)-1] {
			log.Fatal("party_id existiert schon")
		}
	} else { // generate einer freien party_id
		var currentSpareIds = storage.ComputationMaps.SpareIds[computation_id]
		for i := range currentSpareIds {
			if !currentSpareIds[i] {
				party_id = fmt.Sprint(i)
				break
			}
		}
	}

	if party_id != "s1" {
		storage.ComputationMaps.SpareIds[computation_id][conversions.GetPartyIdInt(party_id)-1] = true
	}

	// Initialisierung der Berechnung und definieren aller noch undefinierten Objekten.
	storage.InitComputation(computation_id, party_id, party_count)
	mailbox.Init(computation_id)

	// Initialisierungsnachricht für den Client erstellen
	keymap_to_send := crypto.StoreAndSendPublicKey(storage.ComputationMaps, computation_id, party_id, public_key)

	party_id_int, err := strconv.Atoi(party_id)
	if err != nil {
		log.Fatalln("from_party_id ist kein integer")
	}
	var message = structs.NewInitializePartyMsg(party_id_int, party_count, keymap_to_send)
	return true, message
}
