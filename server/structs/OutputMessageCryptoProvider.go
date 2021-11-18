package structs

type OutputMessageCryptoProvider struct {
	Op_id     string `json:"op_id"`
	Receivers []int  `json:"receivers"`
	Threshold int    `json:"threshold"`
	Zp        int    `json:"Zp"`
	Shares    []int  `json:"shares"`
}
