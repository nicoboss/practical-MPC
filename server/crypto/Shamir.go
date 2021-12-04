package crypto

import (
	"PracticalMPC/Server/JSON"
	"PracticalMPC/Server/mailbox"
	"fmt"
	"log"
)

func ComputeShares(secret int, parties_list []int, threshold int, Zp int) map[int]int {
	var shares = make(map[int]int)

	var t = threshold - 1
	var polynomial = make([]int, t+1)
	polynomial[0] = secret

	for i := 1; i <= t; i++ {
		polynomial[i] = GenerateRandomInt(Zp)
	}

	messagePolynomial := fmt.Sprintf("Crypto Provider Shamir Polynomial: %s", JSON.ToJSON(polynomial))
	log.Println(messagePolynomial)
	mailbox.SendServerToLoggers(messagePolynomial)

	for i := 0; i < len(parties_list); i++ {
		var p_id = parties_list[i]
		shares[p_id] = polynomial[0]
		power := p_id

		for j := 1; j < len(polynomial); j++ {
			var tmp = (polynomial[j] * power) % Zp
			shares[p_id] = (shares[p_id] + tmp) % Zp
			power = (power * p_id) % Zp
		}
	}

	messageShares := fmt.Sprintf("Crypto Provider Shamir Shares: %s", JSON.ToJSON(shares))
	log.Println(messageShares)
	mailbox.SendServerToLoggers(messageShares)

	return shares
}
