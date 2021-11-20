/// <reference path="node_modules/@types/node/index.d.ts" />
/// <reference path="node_modules/vue/ref-macros.d.ts" />
/// <reference path='components/vue-test.ts'/>
/// <reference path='components/connect-button.ts'/>
/// <reference path='components/submit-button.ts'/>

var vueTest = require('./components/vue-test');
var connectButton = require('./components/connect-button');
var submitButton = require('./components/submit-button');

import { createApp } from 'vue';

const app = createApp({})

vueTest.vue_test(app);
connectButton.connect_button(app);
submitButton.submit_button(app);

app.mount('#main_app')
