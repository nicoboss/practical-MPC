module PracticalMPC/Server/Open

go 1.17

require github.com/gorilla/websocket v1.4.2

replace PracticalMPC/Server/JSON => ../JSON

require PracticalMPC/Server/JSON v0.0.0-00010101000000-000000000000

replace PracticalMPC/Server/crypto => ../crypto

replace PracticalMPC/Server/mailbox => ../mailbox

require PracticalMPC/Server/mailbox v0.0.0-00010101000000-000000000000

replace PracticalMPC/Server/storage => ../storage

require PracticalMPC/Server/storage v0.0.0-00010101000000-000000000000
