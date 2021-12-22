/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute_threshold.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute_threshold');

exports.submit_button_threshold = function (app: any) {
  app.component('submit-button-threshold', {
    data() {
      return {
        submitButtonEnabled: true,
      }
    },
    methods: {
      SetEnabled(newState :boolean) {
        this.submitButtonEnabled = newState;
      },
      submitButtonClick() {
        var _this = this;
        let input = parseInt((<HTMLInputElement>document.getElementById("client_input_threshold")).value);
        logger.log("Starten...", logger.LogType.INFO);
        this.submitButtonEnabled = false;
        var promise = mpcCompute.mpc_compute(app, input);
        promise.then(function (result: number) {
          let jiff_instance = app.config.globalProperties.$saved_instance;
          _this.submitButtonEnabled = jiff_instance.crypto_provider;
          app.config.globalProperties.$externalMethods.call('preprocessing_button_threshold.SetEnabled', !jiff_instance.crypto_provider);
          logger.log("Resultat: " + result, logger.LogType.RESULT);
        });
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('submit_button_threshold.SetEnabled', this.SetEnabled)
    },
    template: `
      <button id="submit_button" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}

