module PracticalMPC/Server/mailbox

go 1.17

replace PracticalMPC/Server/structs => ../structs

require PracticalMPC/Server/structs v0.0.0-00010101000000-000000000000

replace PracticalMPC/Server/types => ../types

require PracticalMPC/Server/types v0.0.0-00010101000000-000000000000 // indirect

require github.com/gorilla/websocket v1.4.2 // indirect

replace PracticalMPC/Server/conversions => ../conversions

require PracticalMPC/Server/conversions v0.0.0-00010101000000-000000000000

replace PracticalMPC/Server/storage => ../storage

require PracticalMPC/Server/storage v0.0.0-00010101000000-000000000000
