/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute_sum_threshold.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute_sum_threshold');

exports.submit_button_sum_threshold = function (app: any) {
  app.component('submit-button-sum-threshold', {
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
        let input = parseInt((<HTMLInputElement>document.getElementById("client_input_sum_threshold")).value);
        try {
          var promise = mpcCompute.mpc_compute(app, input);
        } catch(e: any) {
          logger.log(e.name + ': ' + e.message, logger.LogType.ERROR);
          return;
        }
        logger.log("Starten...", logger.LogType.INFO);
        this.submitButtonEnabled = false;
        promise.then(function (result: number) {
          logger.log("Resultat: " + result, logger.LogType.RESULT);
          (<HTMLDivElement>document.getElementById("log_box")).scrollIntoView();
          setTimeout(() => 
          {
            let jiff_instance = app.config.globalProperties.$saved_instance;
            _this.submitButtonEnabled = jiff_instance.crypto_provider;
            app.config.globalProperties.$externalMethods.call('preprocessing_button_sum_threshold.SetEnabled', !jiff_instance.crypto_provider);
          },
          500);
        });
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('submit_button_sum_threshold.SetEnabled', this.SetEnabled)
    },
    template: `
      <button id="submit_button_sum_threshold" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}

