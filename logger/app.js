"use strict";
/// <reference path="node_modules/@types/node/index.d.ts" />
/// <reference path="node_modules/vue/ref-macros.d.ts" />
/// <reference path="node_modules/vuejs-smart-table/dist/types/index.d.ts" />
/// <reference path='components/vue-test.ts'/>
/// <reference path='components/vue-logger.ts'/>
exports.__esModule = true;
var vueTest = require('./components/vue-test');
var vueLogger = require('./components/vue-logger');
var vue_1 = require("vue");
var app = (0, vue_1.createApp)({});
var SmartTable = require('vuejs-smart-table');
SmartTable.install(app);
vueTest.vue_test(app);
vueLogger.vue_logger(app);
app.mount('#main_app');
