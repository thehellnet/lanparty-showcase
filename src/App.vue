<template>
  <div id="app">
    <div class="custom-content">
      <vue-scroll ref="paneScroller">
        <div ref="paneContent" />
        <div ref="paneEnd" />
      </vue-scroll>
    </div>
    <div class="custom-header">
      <h1>{{ titleValue }}</h1>
    </div>
    <div class="custom-footer">
      <div class="separator"></div>
      <div class="footer-clock">{{ clockValue }}</div>
    </div>
    <div
      class="custom-status"
      v-bind:class="{
        'bg-online': statusOnline,
        'bg-offline': !statusOnline,
      }"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action, Command } from "@/model/websocket/command";
import { vuescroll } from "vuescroll/types/vuescroll";
import websocketService from "@/services/websocket.service";
import PaneMatches from "@/components/PaneMatches.vue";
import PaneScores from "@/components/PaneScores.vue";
import { PaneMode } from "@/model/constant/PaneMode";
import { Match } from "@/model/Match";
import { Team } from "@/model/Team";

@Component({
  components: { MatchList: PaneMatches },
})
export default class App extends Vue {
  public titleValue = "";
  public clockValue = "loading...";
  public statusOnline = false;

  private paneContainer!: Element;
  private currentPane!: Vue;

  public created() {
    websocketService.onConnect(() => {
      console.log("WS connected");
      this.statusOnline = true;
    });

    websocketService.onDisconnect(() => {
      console.log("WS disconnected");
      this.statusOnline = false;
    });

    websocketService.onMessage((command) => this.handleCommand(command));
  }

  public mounted() {
    this.paneContainer = this.$refs.paneContent as Element;

    this.updateClock();
    setInterval(this.updateClock, 1000);
  }

  private handleCommand(command: Command) {
    if (command.action == Action.DISPLAY_PANE) {
      this.displayPane(command);
    }
  }

  private displayPane(command: Command) {
    const args = command.args;
    const mode = args.mode;
    const title = args.title;

    console.log("command.args.mode", mode);
    console.log("command.args.title", title);

    this.titleValue = title;

    let newPane: Vue;

    if (mode == PaneMode.MATCHES) {
      newPane = App.preparePaneMatches(command);
    } else if (mode == PaneMode.SCORES) {
      newPane = App.preparePaneScores(command);
    } else {
      return;
    }

    newPane.$mount();

    if (this.currentPane) {
      this.paneContainer.removeChild(this.currentPane.$el);
    }
    this.paneContainer.appendChild(newPane.$el);

    this.currentPane = newPane;

    console.log("mounted", newPane);

    const preScroll = args.preScroll;
    const scrollDuration = args.scrollDuration;

    setTimeout(() => {
      const paneScroller = this.$refs.paneScroller as vuescroll;
      paneScroller.scrollTo({ y: "100%" }, scrollDuration, "easeInOutQuad");
    }, preScroll);
  }

  private updateClock() {
    const now = new Date();

    const year = now.getFullYear().toString().padStart(4, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDay().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");

    this.clockValue = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  private static preparePaneMatches(command: Command) {
    const gameTag: string = command.args.gameTag;
    const matchList: Match[] = command.args.matches;

    return new PaneMatches({
      propsData: {
        gameTag: gameTag,
        matchList: matchList,
      },
    });
  }

  private static preparePaneScores(command: Command) {
    const gameTag: string = command.args.gameTag;
    const teamList: Team[] = command.args.teams;

    return new PaneScores({
      propsData: {
        gameTag: gameTag,
        teamList: teamList,
      },
    });
  }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";

$color-header: navy;
$color-content: #1e1e28;
$color-footer: #2c3e50;
$color-online: #004000;
$color-offline: #600000;
$color-text: aquamarine;

$height-header: 100px;
$height-footer: 20px;
$height-status: 5px;

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-text;
  background-color: $color-content;
}

div.custom-header {
  position: fixed;
  width: 100%;
  top: 0;
  height: $height-header;
  background: linear-gradient(180deg, $color-header 0%, $color-content 100%);
}

div.custom-footer {
  position: fixed;
  width: 100%;
  top: calc(100vh) - ($height-footer + $height-status);
  bottom: $height-status;
  height: $height-footer;
  background: linear-gradient(180deg, $color-content 0%, $color-footer 100%);
  display: flex;
  //justify-content: space-between;
}

div.custom-status {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: $height-status;
}

div.custom-content {
  position: fixed;
  width: 100%;
  top: $height-header;
  bottom: $height-status + $height-footer;
  background-color: $color-content;
  overflow-y: hidden;
}

div.custom-footer div {
  margin-left: 5px;
  margin-right: 5px;
}

div.custom-footer div.separator {
  margin-left: auto;
}

div.footer-clock {
  font-family: "Roboto Condensed", monospace;
}

.bg-online {
  background: linear-gradient(180deg, $color-footer 0%, $color-online 100%);
}

.bg-offline {
  background: linear-gradient(180deg, $color-footer 0%, $color-offline 100%);
}
</style>
