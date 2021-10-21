/// <reference path="node_modules/@types/node/index.d.ts" />
/// <reference path="node_modules/vue/ref-macros.d.ts" />
/// <reference path="jiff-mpc/jiff-client.d.ts" />

var JIFFClient = require('./jiff-mpc/jiff-client');

var saved_instance: any;
exports.mpc_connect = function (hostname: string, computation_id: string, options: any) {
  var opt = Object.assign({}, options);
  opt.crypto_provider = true;
  saved_instance = new JIFFClient(hostname, computation_id, opt);
  return saved_instance;
};

exports.mpc_compute = function (input :any, jiff_instance:any) {
  if (jiff_instance == null) {
    jiff_instance = saved_instance;
  }
  // MPC implementierung
  var shares = jiff_instance.share(input);
  var sum = shares[1];
  for (var i = 2; i <= jiff_instance.party_count; i++) {
    sum = sum.sadd(shares[i]);
  }
  return jiff_instance.open(sum);
};

enum LogType {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  RESULT = "result",
}

function log(message: string, logType: LogType) {
  let infoOutput = document.createElement('p');
  infoOutput.className = logType;
  infoOutput.textContent = message;
  document.getElementById("output")!.appendChild(infoOutput);
}

function handleResult(result: any) {
  log("Result is: " + result, LogType.RESULT);
}


import { createApp } from 'vue';

const app = createApp({})

app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button v-on:click="count++">
      You clicked me {{ count }} times.
    </button>`
})

app.component('button-alert', {
  data() {
    return {
      alertMessage: 'Hi'
    }
  },
  methods: {
    showMsg(arg: string) {
      alert(this.alertMessage);
      this.alertMessage = 'Bye'
    }
  },
  template: `
    <button v-on:click="showMsg('Hi')">
      alert: {{ alertMessage }}
    </button>`
})

app.component('connect-button', {
  data() {
    return {
      connectButtonEnabled: true,
      connectButtonText: 'Hi'
    }
  },
  methods: {
    connectButtonClick() {
      this.connectButtonEnabled = false;
      let computation_id = (<HTMLInputElement>document.getElementById("computation_id")).value;
      let party_count = parseInt((<HTMLInputElement>document.getElementById("count")).value);
    
      if (isNaN(party_count)) {
        log("Die Partyanzahl muss eine gültige Zahl sein!", LogType.ERROR);
        this.connectButtonEnabled = true;
      } else {
        var options: any = { party_count: party_count};
        options.onError = function (_ : any, error : string): any {
          log(error, LogType.ERROR);
          this.connectButtonEnabled = true;
        };
        options.onConnect = function () {
          log("Alle Parteien verbunden!", LogType.INFO);
          this.connectButtonEnabled = false;
        };
    
        var hostname = window.location.hostname.trim();
        var port = window.location.port;
        if (port == null || port === '') {
          port = '80';
        }
        if (!(hostname.startsWith('http://') || hostname.startsWith('https://'))) {
          hostname = 'http://' + hostname;
        }
        if (hostname.endsWith('/')) {
          hostname = hostname.substring(0, hostname.length-1);
        }
        if (hostname.indexOf(':') > -1 && hostname.lastIndexOf(':') > hostname.indexOf(':')) {
          hostname = hostname.substring(0, hostname.lastIndexOf(':'));
        }
    
        hostname = hostname + ':' + port;
        exports.mpc_connect(hostname, computation_id, options);
      }
    }
  },
  template: `
    <button v-on:click="connectButtonClick()" v-bind:disabled="!connectButtonEnabled">
      Connect
    </button>`
})


app.component('submit-button', {
  data() {
    return {
      submitButtonEnabled: true,
      connectButtonText: 'Hi'
    }
  },
  methods: {
    submitButtonClick() {
      let input = parseInt((<HTMLInputElement>document.getElementById("number")).value);
      if (isNaN(input)) {
        log("Der input muss eine gültige Zahl sein!", LogType.ERROR);
        return;
      }
      if (100 < input || input < 0 || input !== Math.floor(input)) {
        log("Die Eingabe muss eine Ganzzahl zwischen 0 und 100 sein!", LogType.ERROR);
        return;
      }
      log("Starten...", LogType.INFO);
      this.submitButtonEnabled = false;
      var promise = exports.mpc_compute(input);
      promise.then(handleResult);
    }
  },
  template: `
    <button v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
      Sum
    </button>`
})

app.mount('#main_app')
