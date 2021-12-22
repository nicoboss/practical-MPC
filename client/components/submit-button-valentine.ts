/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute_valentine.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute_valentine');

exports.submit_button_valentine = function (app: any) {
  app.component('submit-button-valentine', {
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
        let input = (<HTMLInputElement>document.getElementById("ValentineYes")).checked ? 1 : 0;
        logger.log("Starten...", logger.LogType.INFO);
        this.submitButtonEnabled = false;
        var promise = mpcCompute.mpc_compute(app, input);
        promise.then(function (result: number) {
          let jiff_instance = app.config.globalProperties.$saved_instance;
          _this.submitButtonEnabled = jiff_instance.crypto_provider;
          app.config.globalProperties.$externalMethods.call('preprocessing_button_valentine.SetEnabled', !jiff_instance.crypto_provider);
          logger.log("Resultat: " + result, logger.LogType.RESULT);
        });
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('submit_button_valentine.SetEnabled', this.SetEnabled)
    },
    template: `
      <button id="submit_button" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}
