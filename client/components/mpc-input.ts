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
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto" for="client_input">Summand:</label>
            <input type="number" id="client_input_sum" min="0" max="100" value="7"/>
            <submit-button-sum class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Multiplikation">
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto" for="client_input">Faktor:</label>
            <input type="number" id="client_input_multi" min="0" max="100" value="7"/><br/>
            <submit-button-multi class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Valentine">
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto" for="client_input">Liebst du die anderen Teilnehmer?</label><br/>
            <div class="d-flex">
              <input type="radio" id="ValentineYes" name="IsValentine" checked="true"/>
              <label class="mtb-auto" for="IsValentine">Ja</label><br/>
            </div>
            <div class="d-flex">
              <input type="radio" id="ValentineNo" name="IsValentine"/>
              <label class="mtb-auto" for="IsValentine">Nein</label><br/>
            </div>
            <submit-button-valentine class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Abstimmen">
          <div class="command-div d-flex">
            <label class="mtb-auto" for="security_checks">Sicherheitschecks</label><input type="checkbox" id="security_checks" checked="true"/><br/>
            <div class="box">
              <input type="radio" id="VotedCandidate1" name="VotedCandidate" checked="true"/><label for="VotedCandidate">Maximilian Holtzmann</label><br/>
              <input type="radio" id="VotedCandidate2" name="VotedCandidate"/><label for="VotedCandidate">Swen Bachmeier</label><br/>
              <input type="radio" id="VotedCandidate3" name="VotedCandidate"/><label for="VotedCandidate">Andreas Brandt</label><br/>
              <input type="radio" id="VotedCandidate4" name="VotedCandidate"/><label for="VotedCandidate">Jörg Schuster</label><br/>
            </div>
            <submit-button-vote class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Threshold">
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto" for="calculate_threshold">Threshold</label>
            <input type="number" id="threshold_input" min="0" max="100" value="50"/>
            <br/><br/>
            <label class="mtb-auto ml-1rem" for="client_input">Zahl:</label>
            <input type="number" id="client_input_threshold" min="0" max="100" value="77"/><br/>
            <submit-button-threshold class="button-x command-button"/>
          </div>
        </tab-panel>
      </tab-panels>`
  })
}
