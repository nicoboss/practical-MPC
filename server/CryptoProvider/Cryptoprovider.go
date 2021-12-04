package CryptoProvider

import (
	"PracticalMPC/Server/crypto"
	"fmt"
)

func CryptoProviderHandlersTriplet(Zp int, params NumbersParmams) []int {
	var a = crypto.GenerateRandomInt(Zp)
	var b = crypto.GenerateRandomInt(Zp)
	var c = (a * b) % Zp
	secrets := []int{a, b, c}
	return secrets
}

func CryptoProviderHandlersNumbers(Zp int, params NumbersParmams) []int {
	count := params.Count
	bit := params.Bit
	//min := params.Min
	max := params.Max
	number := params.Number
	bitLength := params.BitLength

	if max == 0 {
		max = Zp
	}
	if bit {
		max = 2
	}

	var numbers []int
	if bitLength == 0 {
		numbers = make([]int, count)
	} else {
		numbers = make([]int, bitLength) //Mit 0 initialisiert
	}

	for i := 0; i < count; i++ {
		n := number
		//if number == 0 {
		//	n = GenerateRandomIntInRange(min, max)
		//}
		if bitLength == 0 {
			numbers[i] = n
		} else {
			binString := fmt.Sprintf("%b", n)
			for pos, char := range binString {
				if char == '1' {
					numbers[pos] = 1
				} else {
					numbers[pos] = 0
				}
			}
		}
	}
	return numbers
}
