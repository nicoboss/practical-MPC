module PracticalMPC/Server/crypto

go 1.17

require github.com/gorilla/websocket v1.4.2

replace PracticalMPC/Server/structs => ../structs
require PracticalMPC/Server/structs v0.0.0-00010101000000-000000000000
replace PracticalMPC/Server/types => ../types
require PracticalMPC/Server/types v0.0.0-00010101000000-000000000000
replace PracticalMPC/Server/mailbox => ../mailbox
require PracticalMPC/Server/mailbox v0.0.0-00010101000000-000000000000