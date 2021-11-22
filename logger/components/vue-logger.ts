/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>

import { Console } from "console";

var logger = require('../modules/logger');
var jsonSyntaxHighlight = require('../modules/jsonSyntaxHighlight');

exports.vue_logger = function (app :any) {
  app.component('vue-logger', {
    data() {
      return {
        connection: null
      }
    },
    methods: {
      sendMessage: function(message: any) {
        logger.log(message, logger.LogType.INFO);
        this.connection.send(message);
      }
    },
    created: function() {
      this.connection = new WebSocket("ws://127.0.0.1:8080/logger")
  
      this.connection.onmessage = function(event: any) {
        var loggerMsgObj = JSON.parse(event.data)
        var socketMsgObj = JSON.parse(loggerMsgObj.message)
        var dataMsgObj = JSON.parse(socketMsgObj.data)
        socketMsgObj.data = dataMsgObj
        loggerMsgObj.message = socketMsgObj
        logger.log(jsonSyntaxHighlight.syntaxHighlight(JSON.stringify(loggerMsgObj, undefined, 2)), logger.LogType.INFO);
      }
  
      this.connection.onopen = function(event: any) {
        logger.log(event.data, logger.LogType.INFO)
      }
  
    },
    template: `
      <button v-on:click="sendMessage('register')">
        Send Message
      </button>`
  })
}
