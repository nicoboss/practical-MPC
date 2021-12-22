/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../mpc/mpc_preprocessing_sum_threshold.ts'/>

var mpcPreprocessingsum_threshold = require('../mpc/mpc_preprocessing_sum_threshold');

exports.preprocessing_button_sum_threshold = function (app: any) {
  app.component('preprocessing-button-sum-threshold', {
    data() {
      return {
        preprocessingButtonEnabled: true,
      }
    },
    methods: {
      SetEnabled(newState :boolean) {
        this.preprocessingButtonEnabled = newState;
      },
      preprocessingButtonClick() {
        this.preprocessingButtonEnabled = false;
        mpcPreprocessingsum_threshold.mpc_preprocessing_sum_threshold(app);
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('preprocessing_button_sum_threshold.SetEnabled', this.SetEnabled)
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
