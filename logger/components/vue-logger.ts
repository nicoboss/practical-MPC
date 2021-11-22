/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>

var logger = require('../modules/logger');
var jsonSyntaxHighlight = require('../modules/jsonSyntaxHighlight');

exports.vue_logger = function (app :any) {
  app.component('vue-logger', {
    data() {
      return {
        connection: null,
        connectButtonEnabled: true
      }
    },
    methods: {
      sendMessage: function(message: any) {
        logger.log(message, logger.LogType.INFO);
        this.connection.send(message);
      },
      connectButtonClick() {
        this.connectButtonEnabled = false;
        let hostname = (<HTMLInputElement>document.getElementById("server_address")).value;
        let conn = new WebSocket(hostname);
        this.connection = conn;
    
        conn.onmessage = function(event: any) {
          var loggerMsgObj = JSON.parse(event.data);
          if (loggerMsgObj.loggerProtocol == "ClientToServer" || loggerMsgObj.loggerProtocol == "ServerToClient") {
            var socketMsgObj = JSON.parse(loggerMsgObj.message);
            var dataMsgObj = JSON.parse(socketMsgObj.data);
            socketMsgObj.data = dataMsgObj;
            loggerMsgObj.message = socketMsgObj;
          }
          logger.log(jsonSyntaxHighlight.syntaxHighlight(JSON.stringify(loggerMsgObj, undefined, 2)), logger.LogType.INFO);
        }
    
        conn.onopen = function(event: any) {
          conn.send('register');
        }
        
      },
    },
    template: `
      <button id="connect_button" v-on:click="connectButtonClick()" v-bind:disabled="!connectButtonEnabled">
        Verbinden
      </button>`
  })
}
