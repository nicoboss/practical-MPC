/// <reference path="../node_modules/vue/ref-macros.d.ts" />

exports.vue_logger = function (app :any) {
  app.component('vue-logger', {
    data() {
      return {
        connection: null
      }
    },
    methods: {
      sendMessage: function(message: any) {
        console.log("Hello")
        console.log(this.connection);
        this.connection.send(message);
      }
    },
    created: function() {
      console.log("Starting connection to WebSocket Server")
      this.connection = new WebSocket("ws://127.0.0.1:8080/logger")
  
      this.connection.onmessage = function(event: any) {
        console.log(event);
      }
  
      this.connection.onopen = function(event: any) {
        console.log(event)
        console.log("Successfully connected to the echo websocket server...")
      }
  
    },
    template: `
      <button v-on:click="sendMessage('register')">
        Send Message
      </button>`
  })
}
