cd ..
.\tools\rsync\rsync.exe -rci --delete -e "./tools/rsync/ssh -o UserKnownHostsFile=./tools/rsync/known_hosts -o PubkeyAuthentication=yes -i ./tools/rsync/id_rsa" --exclude=tools/rsync --exclude=client/dist --exclude=client/node_modules --exclude=client/app.js --exclude=server/server.exe --exclude=tester/tester.exe ./* root@mpc.nico.re:/root/MPC/
