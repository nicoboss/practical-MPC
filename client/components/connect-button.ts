/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_connect.ts'/>

var logger = require('../modules/logger');
var mpcConnect = require('../mpc/mpc_connect');

exports.connect_button = function (app: any) {
  app.component('connect-button', {
    data() {
      return {
        connectButtonEnabled: true,
        connectButtonText: "Verbinden",
        isConnecting: false,
        isConnected: false,
        isError: false,
      }
    },
    methods: {
      connectButtonClick() {
        var _this = this;
        this.isConnecting = true;
        this.isError = false;
        this.connectButtonEnabled = false;
        this.connectButtonText = "Warten auf Teilnehmer...";
        let computation_id = (<HTMLInputElement>document.getElementById("computation_id")).value;
        let party_count = parseInt((<HTMLInputElement>document.getElementById("party_count")).value);
      
        if (isNaN(party_count)) {
          logger.log("Die Partyanzahl muss eine gültige Zahl sein!", logger.LogType.ERROR);
          this.connectButtonEnabled = true;
        } else {
          var options: any = { party_count: party_count};
          options.onError = function (_ : any, error : string): any {
            logger.log(error, logger.LogType.ERROR);
            (<HTMLDivElement>document.getElementById("calculate_box")).classList.add("disable-controls");
            (<HTMLDivElement>document.getElementById("settings_box")).classList.remove("disable-controls");
            (<HTMLDivElement>document.getElementById("settings_box")).scrollIntoView();
            _this.connectButtonText = "Verbinden erneut versuchen";
            _this.isConnected = false;
            _this.connectButtonEnabled = true;
            _this.isError = true;
            _this.isConnecting = false;
          };
          options.onConnect = function () {
            _this.isConnected = true;
            _this.isError = false;
            _this.isConnecting = false;
            _this.connectButtonText = "Verbunden";
            logger.log("Alle Parteien verbunden!", logger.LogType.INFO);
            this.connectButtonEnabled = false;
            (<HTMLDivElement>document.getElementById("settings_box")).classList.add("disable-controls");
            (<HTMLDivElement>document.getElementById("calculate_box")).classList.remove("disable-controls");
            (<HTMLDivElement>document.getElementById("calculate_box")).scrollIntoView();
          };
          
          let hostname = (<HTMLInputElement>document.getElementById("server_address")).value;
          let use_crypto_provider = (<HTMLInputElement>document.getElementById("use_crypto_provider")).checked;
          let ext = app.config.globalProperties.$externalMethods;

          ext.call('preprocessing_button_sum.SetEnabled', !use_crypto_provider);
          ext.call('preprocessing_button_multi.SetEnabled', !use_crypto_provider);
          ext.call('preprocessing_button_div.SetEnabled', !use_crypto_provider);
          ext.call('preprocessing_button_valentine.SetEnabled', !use_crypto_provider);
          ext.call('preprocessing_button_vote_person.SetEnabled', !use_crypto_provider);
          ext.call('preprocessing_button_vote_gpu.SetEnabled', !use_crypto_provider);
          ext.call('preprocessing_button_threshold.SetEnabled', !use_crypto_provider);
          ext.call('preprocessing_button_sum_threshold.SetEnabled', !use_crypto_provider);
          ext.call('preprocessing_button_standard_deviation.SetEnabled', !use_crypto_provider);

          ext.call('submit_button_sum.SetEnabled', use_crypto_provider);
          ext.call('submit_button_multi.SetEnabled', use_crypto_provider);
          ext.call('submit_button_div.SetEnabled', use_crypto_provider);
          ext.call('submit_button_valentine.SetEnabled', use_crypto_provider);
          ext.call('submit_button_vote_person.SetEnabled', use_crypto_provider);
          ext.call('submit_button_vote_gpu.SetEnabled', use_crypto_provider);
          ext.call('submit_button_threshold.SetEnabled', use_crypto_provider);
          ext.call('submit_button_sum_threshold.SetEnabled', use_crypto_provider);
          ext.call('submit_button_standard_deviation.SetEnabled', use_crypto_provider);

          mpcConnect.mpc_connect(app, hostname, computation_id, use_crypto_provider, options);
        }
      }
    },
    template: `
      <button id="connect_button" v-on:click="connectButtonClick()" :disabled="!connectButtonEnabled" :class="{ 'button-x-connecting': isConnecting, 'button-x-connected': isConnected, 'button-x-error': isError }">
        <span>{{connectButtonText}}</span>
        <span v-if="isConnecting" class="loader">
          <span class="loader-box"></span>
          <span class="loader-box"></span>
          <span class="loader-box"></span>
        </span>
      </button>`
  })
}
