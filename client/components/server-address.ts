/// <reference path="../node_modules/vue/ref-macros.d.ts" />

exports.server_address = function (app: any) {
  app.component('server-address', {
    data() {
        return {
            serveAddrEnv: "http://" + (process.env.SERVER_ADDRESS || '127.0.0.1').trim(),
        }
    },
    template: `
        <label for="server_address">Serveradresse:</label><input type="text" id="server_address" :value="serveAddrEnv"/><br/><br/>`
  })
}
