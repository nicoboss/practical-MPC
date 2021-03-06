/// <reference path="node_modules/@types/node/index.d.ts" />
/// <reference path="node_modules/vue/ref-macros.d.ts" />
/// <reference path='components/vue-test.ts'/>
/// <reference path='components/server-address.ts'/>
/// <reference path='components/connect-button.ts'/>
/// <reference path='components/mpc-input.ts'/>
/// <reference path='components/preprocessing-button-sum.ts'/>
/// <reference path='components/preprocessing-button-multi.ts'/>
/// <reference path='components/preprocessing-button-div.ts'/>
/// <reference path='components/preprocessing-button-valentine.ts'/>
/// <reference path='components/preprocessing-button-vote-person.ts'/>
/// <reference path='components/preprocessing-button-vote-gpu.ts'/>
/// <reference path='components/preprocessing-button-threshold.ts'/>
/// <reference path='components/preprocessing-button-sum-threshold.ts'/>
/// <reference path='components/preprocessing-button-standard-deviation.ts'/>
/// <reference path='components/submit-button-sum.ts'/>
/// <reference path='components/submit-button-multi.ts'/>
/// <reference path='components/submit-button-div.ts'/>
/// <reference path='components/submit-button-valentine.ts'/>
/// <reference path='components/submit-button-vote-person.ts'/>
/// <reference path='components/submit-button-vote-gpu.ts'/>
/// <reference path='components/submit-button-threshold.ts'/>
/// <reference path='components/submit-button-sum-threshold.ts'/>
/// <reference path='components/submit-button-standard-deviation.ts'/>

var vueTest = require('./components/vue-test');
var serverAddress = require('./components/server-address');
var connectButton = require('./components/connect-button');
var mpcInput = require('./components/mpc-input');
var preprocessingButtonSum = require('./components/preprocessing-button-sum');
var preprocessingButtonMulti = require('./components/preprocessing-button-multi');
var preprocessingButtonDiv = require('./components/preprocessing-button-div');
var preprocessingButtonValentine = require('./components/preprocessing-button-valentine');
var preprocessingButtonVotePerson = require('./components/preprocessing-button-vote-person');
var preprocessingButtonVoteGpu = require('./components/preprocessing-button-vote-gpu');
var preprocessingButtonThreshold = require('./components/preprocessing-button-threshold');
var preprocessingButtonSumThreshold = require('./components/preprocessing-button-sum-threshold');
var preprocessingButtonStandardDeviation = require('./components/preprocessing-button-standard-deviation');
var submitButtonSum = require('./components/submit-button-sum');
var submitButtonMulti = require('./components/submit-button-multi');
var submitButtonDiv = require('./components/submit-button-div');
var submitButtonValentine = require('./components/submit-button-valentine');
var submitButtonVotePerson = require('./components/submit-button-vote-person');
var submitButtonVoteGPU = require('./components/submit-button-vote-gpu');
var submitButtonThreshold = require('./components/submit-button-threshold');
var submitButtonSumThreshold = require('./components/submit-button-sum-threshold');
var submitButtonStandardDeviation = require('./components/submit-button-standard-deviation');
var tabs = require('vue3-tabs');

import { createApp } from 'vue';

const app = createApp({});

app.use(tabs.Tabs);
app.use(tabs.Tab);
app.use(tabs.TabPanels);
app.use(tabs.TabPanel);
app.use({
    install(app) {
      this.methods = {};
      app.config.globalProperties.$externalMethods = {
        register: (method :any, func :any) => this.methods[method] = func,
        call: (method :any, ...args :any) => this.methods[method](...args)
      }
    }
});

vueTest.vue_test(app);
serverAddress.server_address(app);
connectButton.connect_button(app);
mpcInput.mpc_input(app);
preprocessingButtonSum.preprocessing_button_sum(app);
preprocessingButtonMulti.preprocessing_button_multi(app);
preprocessingButtonDiv.preprocessing_button_div(app);
preprocessingButtonValentine.preprocessing_button_valentine(app);
preprocessingButtonVotePerson.preprocessing_button_vote_person(app);
preprocessingButtonVoteGpu.preprocessing_button_vote_gpu(app);
preprocessingButtonThreshold.preprocessing_button_threshold(app);
preprocessingButtonSumThreshold.preprocessing_button_sum_threshold(app);
preprocessingButtonStandardDeviation.preprocessing_button_standard_deviation(app);
submitButtonSum.submit_button_sum(app);
submitButtonMulti.submit_button_multi(app);
submitButtonDiv.submit_button_div(app);
submitButtonValentine.submit_button_valentine(app);
submitButtonVotePerson.submit_button_vote_person(app);
submitButtonVoteGPU.submit_button_vote_gpu(app);
submitButtonThreshold.submit_button_threshold(app);
submitButtonSumThreshold.submit_button_sum_threshold(app);
submitButtonStandardDeviation.submit_button_standard_deviation(app);

app.mount('#main_app');
