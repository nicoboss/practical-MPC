/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../mpc/mpc_preprocessing_standard_deviation.ts'/>

var mpcPreprocessingstandard_deviation = require('../mpc/mpc_preprocessing_standard_deviation');

exports.preprocessing_button_standard_deviation = function (app :any) {
  app.component('preprocessing-button-standard-deviation', {
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
        mpcPreprocessingstandard_deviation.mpc_preprocessing_standard_deviation();
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('preprocessing_button_standard_deviation.SetEnabled', this.SetEnabled)
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
