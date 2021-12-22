/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../mpc/mpc_preprocessing_threshold.ts'/>

var mpcPreprocessingthreshold = require('../mpc/mpc_preprocessing_threshold');

exports.preprocessing_button_threshold = function (app: any) {
  app.component('preprocessing-button-threshold', {
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
        mpcPreprocessingthreshold.mpc_preprocessing_threshold(app);
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('preprocessing_button_threshold.SetEnabled', this.SetEnabled)
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
