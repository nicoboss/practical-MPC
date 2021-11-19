package crypto

import (
	"PracticalMPC/Server/structs"
	"log"
)

func CryptoProviderHandlersNumbers(Zp int, params structs.NumbersParmams) []int {
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

	numbers := make([]int, count)
	for i := 0; i < count; i++ {
		n := number
		//if number == 0 {
		//	n = GenerateRandomIntInRange(min, max)
		//}

		if bitLength == 0 {
			numbers[i] = n
		} else {
			log.Fatalln("number_to_bits nicht implementiert!")
		}
	}

	return numbers
}
