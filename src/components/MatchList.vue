<template>
  <div class="container-fluid">
    <table class="table table-dark">
      <thead>
        <tr>
          <th scope="col">Team A</th>
          <th scope="col">Team B</th>
          <th scope="col">Map</th>
          <th scope="col">Gametype</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in matchList" :key="match.id">
          <td>{{ match.localTeam }}</td>
          <td>{{ match.guestTeam }}</td>
          <td>{{ match.gameMap }}</td>
          <td>{{ match.gametype }}</td>
          <td>{{ match.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Match } from "@/model/matches/Match";

@Component
export default class MatchList extends Vue {
  @Prop({ required: true })
  gameTag!: string;

  @Prop({ required: true })
  matchList!: Match[];
}
</script>

<style scoped lang="scss"></style>
