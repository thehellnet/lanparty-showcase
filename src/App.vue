<template>
  <div id="app">
    <div class="custom-content">
      <vue-scroll ref="paneScroller">
        <div ref="paneContent" />
        <div ref="paneEnd" />
      </vue-scroll>
    </div>
    <div class="custom-header" />
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
import PaneMatches from "@/components/PaneMatches.vue";
import websocketService from "@/services/websocket.service";
import { Action, Command } from "@/model/websocket/command";
import { PaneMode } from "@/model/constant/PaneMode";
import { Match } from "@/model/matches/Match";
import { vuescroll } from "vuescroll/types/vuescroll";

@Component({
  components: { MatchList: PaneMatches },
})
export default class App extends Vue {
  public clockValue = "loading...";
  public statusOnline = false;

  public created() {
    setInterval(this.updateClock, 1000);

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

  private handleCommand(command: Command) {
    if (command.action == Action.DISPLAY_PANE) {
      if (command.args.mode == PaneMode.MATCHES) {
        const gameTag: string = command.args.gameTag;
        const matchList: Match[] = command.args.matches;

        const componentInstance = new PaneMatches({
          propsData: {
            gameTag: gameTag,
            matchList: matchList,
          },
        });

        const paneContent: Element = this.$refs.paneContent as Element;
        componentInstance.$mount(paneContent).$el;

        setTimeout(() => {
          const paneScroller = this.$refs.paneScroller as vuescroll;
          paneScroller.scrollTo({ y: "100%" }, 8000, "easeInOutQuad");
        }, 500);
      }
    }
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
