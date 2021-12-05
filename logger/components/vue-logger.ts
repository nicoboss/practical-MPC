/// <reference path="../node_modules/vue/ref-macros.d.ts" />

var jsonSyntaxHighlight = require('../modules/jsonSyntaxHighlight');

var users = [];

exports.vue_logger = function (app :any) {
  app.component('vue-logger', {
    data() {
      return {
        users,
        connection: null,
        connectButtonEnabled: true,
        selectedRows: [],
        filters: {
          loggerProtocol: { value: { ClientToServer: true, ServerToClient: true, ServerToLogger: true, ClientToLogger: true }, custom: this.ageFilter }
        }
      }
    },
    methods: {
      ageFilter (filterValue, row) {
        var comp = !(row.loggerProtocol in filterValue) || filterValue[row.loggerProtocol] === true;
        console.log(JSON.stringify(filterValue) + " | " + JSON.stringify(row) + " | " + row.loggerProtocol + " | " + comp);
        return comp;
      },
      selectAll () {
        this.$refs.usersTable.selectAll();
      },
      deselectAll () {
        this.$refs.usersTable.deselectAll();
      },
      sendMessage: function(message: any) {
        this.connection.send(message);
      },
      connectButtonClick() {
        var _this = this;
        this.connectButtonEnabled = false;
        let hostname = (<HTMLInputElement>document.getElementById("server_address")).value;
        let conn = new WebSocket(hostname);
        this.connection = conn;
    
        conn.onmessage = function(event: any) {
          var loggerMsgObj = JSON.parse(event.data);
          if (loggerMsgObj.loggerProtocol == "ClientToServer" || loggerMsgObj.loggerProtocol == "ServerToClient") {
            var socketMsgObj = JSON.parse(loggerMsgObj.message);
            var dataMsgObj = JSON.parse(socketMsgObj.data);
            socketMsgObj.data = dataMsgObj;
            loggerMsgObj.message = socketMsgObj;
          }

          loggerMsgObj.html = jsonSyntaxHighlight.syntaxHighlight(JSON.stringify(loggerMsgObj, undefined, 2));
          _this.users.push(JSON.parse(JSON.stringify(loggerMsgObj)));
          loggerMsgObj.loggerProtocol = "ClientToServer"
          loggerMsgObj.message = "Hallo";
          loggerMsgObj.html = jsonSyntaxHighlight.syntaxHighlight(JSON.stringify(loggerMsgObj, undefined, 2));
          _this.users.push(JSON.parse(JSON.stringify(loggerMsgObj)));
          loggerMsgObj.loggerProtocol = "ServerToClient"
          loggerMsgObj.message = "Welt!";
          loggerMsgObj.html = jsonSyntaxHighlight.syntaxHighlight(JSON.stringify(loggerMsgObj, undefined, 2));
          _this.users.push(JSON.parse(JSON.stringify(loggerMsgObj)));
          loggerMsgObj.loggerProtocol = "ServerToLogger"
          loggerMsgObj.message = "Logger 99 registriert!";
          loggerMsgObj.html = jsonSyntaxHighlight.syntaxHighlight(JSON.stringify(loggerMsgObj, undefined, 2));
          _this.users.push(JSON.parse(JSON.stringify(loggerMsgObj)));
          loggerMsgObj.loggerProtocol = "ClientToLogger"
          loggerMsgObj.message = "Logger 100 registriert!";
          loggerMsgObj.html = jsonSyntaxHighlight.syntaxHighlight(JSON.stringify(loggerMsgObj, undefined, 2));
          _this.users.push(JSON.parse(JSON.stringify(loggerMsgObj)));
          console.log(users);
        }
    
        conn.onopen = function(event: any) {
          conn.send('register');
        }
        
      },
    },
    template: `
      <button id="connect_button" v-on:click="connectButtonClick()" v-bind:disabled="!connectButtonEnabled">
        Verbinden!
      </button>
      <label>Filtern:</label>
      <input v-model.number="filters.loggerProtocol.value.ClientToServer" type="checkbox" id="ClientToServerFilter" checked>
      <label for="ClientToServerFilter">ClientToServer</label>
      <input v-model.number="filters.loggerProtocol.value.ServerToClient" type="checkbox" id="ServerToClientFilter" checked>
      <label for="ServerToClientFilter">ServerToClient</label>
      <input v-model.number="filters.loggerProtocol.value.ServerToLogger" type="checkbox" id="ServerToLogger" checked>
      <label for="ServerToLoggerFilter">ServerToLogger</label>
      <input v-model.number="filters.loggerProtocol.value.ClientToLogger" type="checkbox" id="ClientToLogger" checked>
      <label for="ClientToLoggerFilter">ClientToLogger</label>
      <button v-on:click="selectAll()">Select All</button>
      <button v-on:click="deselectAll()">Deselect All</button>
      <VTable
      ref="usersTable"
      :data="users"
      :filters="filters"
      :hideSortIcons="false"
      selectionMode="multiple"
      selectedClass="selected-row"
      @stateChanged="selectedRows = $event.selectedRows">
        <template #head>
          <VTh sortKey="loggerProtocol">loggerProtocol</VTh>
          <VTh sortKey="message">message</VTh>
        </template>
        <template #body="{ rows }">
          <VTr
          v-for="row in rows"
          :key="rows"
          :row="row">
            <td>{{ row.loggerProtocol }}</td>
            <td>{{ row.message }}</td>
          </VTr>
        </template>
      </VTable>
      <strong>Selected:</strong>
      <div v-if="selectedRows.length === 0">
        Nichts ausgewählt
      </div>
      <div v-for="selected in selectedRows">
        <pre v-html="selected.html"></pre>
      </div>`
  })
}
