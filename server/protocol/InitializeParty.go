package protocol

import (
	"PracticalMPC/Server/conversions"
	"PracticalMPC/Server/crypto"
	"PracticalMPC/Server/storage"
	"PracticalMPC/Server/structs"
	"PracticalMPC/Server/types"
	"fmt"
	"log"
)

// Initialisierung einer Partei. Rückgabe: Initialisierungsnachricht mit der Partei-ID oder eine Fehlermeldung
func initializeParty(computation_id string, party_id string, public_key types.JSON_key, party_count int, _s1 bool) (bool, *structs.InitializePartyMsg) {

	log.Println("Server inizialisiert mit ", computation_id, "-", party_id, " #", party_count, "::", _s1)

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

	// Initialisierungsnachricht für den Client erstellen
	keymap_to_send := crypto.StoreAndSendPublicKey(storage.ComputationMaps, computation_id, party_id, public_key)

	var message = structs.NewInitializePartyMsg(party_id, party_count, keymap_to_send)
	return true, message
}
