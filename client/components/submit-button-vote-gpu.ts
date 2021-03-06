/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute_vote_gpu.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute_vote_gpu');

exports.submit_button_vote_gpu = function (app: any) {
  app.component('submit-button-vote-gpu', {
    data() {
      return {
        submitButtonEnabled: true,
      }
    },
    methods: {
      SetEnabled(newState: boolean) {
        this.submitButtonEnabled = newState;
      },
      submitButtonClick() {
        var _this = this;
        let input1 = Number(Array.prototype.slice.call(document.getElementsByName("GPU_Vote_1")).filter(item => item.checked)[0].value);
        let input2 = Number(Array.prototype.slice.call(document.getElementsByName("GPU_Vote_2")).filter(item => item.checked)[0].value);
        let input3 = Number(Array.prototype.slice.call(document.getElementsByName("GPU_Vote_3")).filter(item => item.checked)[0].value);
        let input4 = Number(Array.prototype.slice.call(document.getElementsByName("GPU_Vote_4")).filter(item => item.checked)[0].value);
        let inputs:number[] = [input1, input2, input3, input4];
        let security_checks = (<HTMLInputElement>document.getElementById("vote_gpu_security_checks")).checked;
        try {
          var promise = mpcCompute.mpc_compute(app, inputs, security_checks);
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
            app.config.globalProperties.$externalMethods.call('preprocessing_button_vote_gpu.SetEnabled', !jiff_instance.crypto_provider);
          },
          500);
        });
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('submit_button_vote_gpu.SetEnabled', this.SetEnabled)
    },
    template: `
      <button id="submit_button_vote_gpu" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}
