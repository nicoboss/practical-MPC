/// <reference path="../node_modules/vue/ref-macros.d.ts" />

var tabs = ['Summe', 'Multiplikation', 'Valentine', 'Abstimmen', 'Threshold'];

exports.mpc_input = function (app :any) {
  app.component('mpc-input', {
    data() {
      return {
        tabs,
        selectedTab: 'Summe',
      }
    },
    template: `
      <tabs v-model="selectedTab">
        <tab
          class="tab"
          v-for="(tab, i) in tabs"
          :val="tab"
          :label="tab"
          :indicator="true"/>
      </tabs>
      <tab-panels v-model="selectedTab" :animate="true">
        <tab-panel val="Summe">
          <label for="client_input">Summand:</label>
          <input type="number" id="client_input_sum" min="0" max="100" value="7"/><br/>
          <submit-button-sum class="button-x"/>
        </tab-panel>
        <tab-panel val="Multiplikation">
          <label for="client_input">Faktor:</label>
          <input type="number" id="client_input_multi" min="0" max="100" value="7"/><br/>
          <submit-button-multi class="button-x"/>
        </tab-panel>
        <tab-panel val="Valentine">
          <label for="client_input">Liebst du die anderen Teilnehmer?</label><br/>
          <input type="radio" id="ValentineYes" name="IsValentine" checked="true"/>
          <label for="IsValentine">Ja</label><br/>
          <input type="radio" id="ValentineNo" name="IsValentine"/>
          <label for="IsValentine">Nein</label><br/>
          <submit-button-valentine class="button-x"/>
        </tab-panel>
        <tab-panel val="Abstimmen">
          <label for="security_checks">Sicherheitschecks</label><input type="checkbox" id="security_checks" checked="true"/><br/>
          <div class="box">
            <input type="radio" id="VotedCandidate1" name="VotedCandidate" checked="true"/><label for="VotedCandidate">Maximilian Holtzmann</label><br/>
            <input type="radio" id="VotedCandidate2" name="VotedCandidate"/><label for="VotedCandidate">Swen Bachmeier</label><br/>
            <input type="radio" id="VotedCandidate3" name="VotedCandidate"/><label for="VotedCandidate">Andreas Brandt</label><br/>
            <input type="radio" id="VotedCandidate4" name="VotedCandidate"/><label for="VotedCandidate">Jörg Schuster</label><br/>
          </div>
          <submit-button-vote class="button-x"/>
        </tab-panel>
        <tab-panel val="Threshold">
          <label for="calculate_threshold">Threshold</label>
          <input type="number" id="threshold_input" min="0" max="100" value="50"/>
          <br/><br/>
          <label for="client_input">Zahl:</label>
          <input type="number" id="client_input_threshold" min="0" max="100" value="77"/><br/>
          <submit-button-threshold class="button-x"/>
        </tab-panel>
      </tab-panels>`
  })
}
