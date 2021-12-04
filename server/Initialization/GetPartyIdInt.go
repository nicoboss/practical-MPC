package Initialization

import (
	"log"
	"strconv"
)

func GetPartyIdInt(party_id string) int {
	party_id_int, err := strconv.Atoi(party_id)
	if err != nil {
		log.Fatal("party_id \"" + party_id + "\" ist keine Ganzzahl")
	}
	return party_id_int
}
