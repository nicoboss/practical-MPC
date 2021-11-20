/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_connect.ts'/>

var logger = require('../modules/logger');
var mpcConnect = require('../mpc/mpc_connect');

exports.connect_button = function (app :any) {
  app.component('connect-button', {
    data() {
      return {
        connectButtonEnabled: true,
      }
    },
    methods: {
      connectButtonClick() {
        this.connectButtonEnabled = false;
        let computation_id = (<HTMLInputElement>document.getElementById("computation_id")).value;
        let party_count = parseInt((<HTMLInputElement>document.getElementById("party_count")).value);
      
        if (isNaN(party_count)) {
          logger.log("Die Partyanzahl muss eine gültige Zahl sein!", logger.LogType.ERROR);
          this.connectButtonEnabled = true;
        } else {
          var options: any = { party_count: party_count};
          options.onError = function (_ : any, error : string): any {
            logger.log(error, logger.LogType.ERROR);
            this.connectButtonEnabled = true;
          };
          options.onConnect = function () {
            logger.log("Alle Parteien verbunden!", logger.LogType.INFO);
            this.connectButtonEnabled = false;
          };
      
          var hostname = window.location.hostname.trim();
          var port = '8080';
          if (port == null || port === '') {
            port = '80';
          }
          if (!(hostname.startsWith('http://') || hostname.startsWith('https://'))) {
            hostname = 'http://' + hostname;
          }
          if (hostname.endsWith('/')) {
            hostname = hostname.substring(0, hostname.length-1);
          }
          if (hostname.indexOf(':') > -1 && hostname.lastIndexOf(':') > hostname.indexOf(':')) {
            hostname = hostname.substring(0, hostname.lastIndexOf(':'));
          }
      
          hostname = hostname + ':' + port;
          mpcConnect.mpc_connect(hostname, computation_id, options);
        }
      }
    },
    template: `
      <button id="connect_button" v-on:click="connectButtonClick()" v-bind:disabled="!connectButtonEnabled">
        Verbinden
      </button>`
  })
}