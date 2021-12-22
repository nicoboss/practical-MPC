/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute_standard_deviation.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute_standard_deviation');

exports.submit_button_standard_deviation = function (app :any) {
  app.component('submit-button-standard-deviation', {
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
        let input = parseInt((<HTMLInputElement>document.getElementById("client_input_standard_deviation")).value);
        logger.log("Starten...", logger.LogType.INFO);
        this.submitButtonEnabled = false;
        var promise = mpcCompute.mpc_compute(input);
        promise.then(handleResultStandardDeviation);
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('submit_button_standard_deviation.SetEnabled', this.SetEnabled)
    },
    template: `
      <button id="submit_button" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}

function handleResultStandardDeviation(result: any) {
  this.submitButtonEnabled = true;
  logger.log("Resultat: " + result, logger.LogType.RESULT);
}
