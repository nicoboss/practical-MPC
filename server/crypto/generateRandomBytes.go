package crypto

import (
	"crypto/rand"
	"fmt"
	"io"
)

func assertAvailablePRNG() {
	buf := make([]byte, 1)
	_, err := io.ReadFull(rand.Reader, buf)
	if err != nil {
		panic(fmt.Sprintf("Kein kryptographisch sicheren Zufallsgenerator vorhanden: crypto/rand: Read() failed with %#v", err))
	}
}

func generateRandomBytes(n int) []uint8 {
	assertAvailablePRNG()
	b := make([]uint8, n)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}
	return b
}
