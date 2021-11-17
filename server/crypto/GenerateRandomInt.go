package crypto

import (
	"crypto/rand"
	"encoding/binary"
)

func GenerateRandomInt(max int) int {
	assertAvailablePRNG()
	b := make([]uint8, 8)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}
	randomUint64 := binary.LittleEndian.Uint64(b)
	randomInt := int(randomUint64 % uint64(max))
	return randomInt
}

func GenerateRandomIntInRange(min int, max int) int {
	return GenerateRandomInt(max-min) + min
}
