/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_connect.ts'/>
/// <reference path='../mpc/mpc_preprocessing.ts'/>

var logger = require('../modules/logger');
var mpcConnect = require('../mpc/mpc_connect');
var mpcPreprocessing = require('../mpc/mpc_preprocessing');

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
            var use_crypto_provider: boolean;
            use_crypto_provider = (<HTMLInputElement>document.getElementById("use_crypto_provider")).checked;
            if (!use_crypto_provider) {
              mpcPreprocessing.mpc_preprocessing();
            }
            logger.log("Alle Parteien verbunden!", logger.LogType.INFO);
            this.connectButtonEnabled = false;
          };
          
          let hostname = (<HTMLInputElement>document.getElementById("server_address")).value;
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