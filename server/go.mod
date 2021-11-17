module PracticalMPC/Server

go 1.17

require github.com/gorilla/websocket v1.4.2 // indirect

require github.com/miguelsandro/curve25519-go v0.0.0-20171107140843-564b467e915d // indirect

replace PracticalMPC/Server/structs => ./structs

require PracticalMPC/Server/structs v0.0.0-00010101000000-000000000000 // indirect

replace PracticalMPC/Server/types => ./types

require PracticalMPC/Server/types v0.0.0-00010101000000-000000000000 // indirect

replace PracticalMPC/Server/conversions => ./conversions

require PracticalMPC/Server/conversions v0.0.0-00010101000000-000000000000 // indirect

replace PracticalMPC/Server/crypto => ./crypto

require PracticalMPC/Server/crypto v0.0.0-00010101000000-000000000000 // indirect

replace PracticalMPC/Server/mailbox => ./mailbox

require PracticalMPC/Server/mailbox v0.0.0-00010101000000-000000000000 // indirect

replace PracticalMPC/Server/storage => ./storage

require PracticalMPC/Server/storage v0.0.0-00010101000000-000000000000

replace PracticalMPC/Server/socket => ./socket

require PracticalMPC/Server/socket v0.0.0-00010101000000-000000000000

replace PracticalMPC/Server/protocol => ./protocol

require PracticalMPC/Server/protocol v0.0.0-00010101000000-000000000000 // indirect
