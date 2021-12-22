/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../mpc/mpc_preprocessing_sum.ts'/>

var mpcPreprocessingSum = require('../mpc/mpc_preprocessing_sum');

exports.preprocessing_button_sum = function (app: any) {
  app.component('preprocessing-button-sum', {
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
        mpcPreprocessingSum.mpc_preprocessing_sum(app);
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('preprocessing_button_sum.SetEnabled', this.SetEnabled)
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
