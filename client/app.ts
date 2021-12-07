/// <reference path="node_modules/@types/node/index.d.ts" />
/// <reference path="node_modules/vue/ref-macros.d.ts" />
/// <reference path='components/vue-test.ts'/>
/// <reference path='components/connect-button.ts'/>
/// <reference path='components/mpc-input.ts'/>
/// <reference path='components/submit-button-sum.ts'/>
/// <reference path='components/submit-button-multi.ts'/>
/// <reference path='components/submit-button-valentine.ts'/>
/// <reference path='components/submit-button-vote.ts'/>
/// <reference path='components/submit-button-threshold.ts'/>

var vueTest = require('./components/vue-test');
var connectButton = require('./components/connect-button');
var mpcInput = require('./components/mpc-input');
var submitButtonSum = require('./components/submit-button-sum');
var submitButtonMulti = require('./components/submit-button-multi');
var submitButtonValentine = require('./components/submit-button-valentine');
var submitButtonVote = require('./components/submit-button-vote');
var submitButtonThreshold = require('./components/submit-button-threshold');
var tabs = require('vue3-tabs');

import { createApp } from 'vue';

const app = createApp({})
app.use(tabs.Tabs);
app.use(tabs.Tab);
app.use(tabs.TabPanels);
app.use(tabs.TabPanel);

vueTest.vue_test(app);
connectButton.connect_button(app);
mpcInput.mpc_input(app);
submitButtonSum.submit_button_sum(app);
submitButtonMulti.submit_button_multi(app);
submitButtonValentine.submit_button_valentine(app);
submitButtonVote.submit_button_vote(app);
submitButtonThreshold.submit_button_threshold(app);

app.mount('#main_app')
