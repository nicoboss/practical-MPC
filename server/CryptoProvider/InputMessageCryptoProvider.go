package CryptoProvider

type InputMessageCryptoProvider struct {
	Label     string
	Op_id     string
	Receivers []int
	Threshold int
	Zp        int
	Params    NumbersParmams
}
