module PracticalMPC/Server

go 1.17

require github.com/gorilla/websocket v1.4.2

require github.com/miguelsandro/curve25519-go v0.0.0-20171107140843-564b467e915d

replace PracticalMPC/Server/structs => ./structs
require PracticalMPC/Server/structs v0.0.0-00010101000000-000000000000
replace PracticalMPC/Server/types => ./types
require PracticalMPC/Server/types v0.0.0-00010101000000-000000000000
