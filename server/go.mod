module PracticalMPC/Server

go 1.17

require github.com/gorilla/websocket v1.4.2 // indirect

replace PracticalMPC/Server/JSON => ./JSON

require PracticalMPC/Server/JSON v0.0.0-00010101000000-000000000000 // indirect

replace PracticalMPC/Server/crypto => ./crypto

replace PracticalMPC/Server/mailbox => ./mailbox

require (
	PracticalMPC/Server/crypto v0.0.0-00010101000000-000000000000 // indirect
	PracticalMPC/Server/mailbox v0.0.0-00010101000000-000000000000 // indirect
	github.com/miguelsandro/curve25519-go v0.0.0-20171107140843-564b467e915d // indirect
)

replace PracticalMPC/Server/storage => ./storage

require PracticalMPC/Server/storage v0.0.0-00010101000000-000000000000

replace PracticalMPC/Server/socket => ./socket

require PracticalMPC/Server/socket v0.0.0-00010101000000-000000000000

replace PracticalMPC/Server/CryptoProvider => ./CryptoProvider

require PracticalMPC/Server/CryptoProvider v0.0.0-00010101000000-000000000000 // indirect

replace PracticalMPC/Server/Custom => ./Custom

require PracticalMPC/Server/Custom v0.0.0-00010101000000-000000000000 // indirect

replace PracticalMPC/Server/Initialization => ./Initialization

require PracticalMPC/Server/Initialization v0.0.0-00010101000000-000000000000 // indirect

replace PracticalMPC/Server/Open => ./Open

require PracticalMPC/Server/Open v0.0.0-00010101000000-000000000000 // indirect

replace PracticalMPC/Server/Share => ./Share

require PracticalMPC/Server/Share v0.0.0-00010101000000-000000000000 // indirect
