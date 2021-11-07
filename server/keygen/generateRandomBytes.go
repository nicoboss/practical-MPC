package keygen

import "crypto/rand"

func generateRandomBytes(n int) []uint8 {
	b := make([]uint8, n)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}
	return b
}
