<template>
  <div class="container-fluid">
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th scope="col" class="sticky-top bg-dark">Team A</th>
          <th scope="col" class="sticky-top bg-dark">Team B</th>
          <th scope="col" class="sticky-top bg-dark">Map</th>
          <th scope="col" class="sticky-top bg-dark">Gametype</th>
          <th scope="col" class="sticky-top bg-dark">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in matchList" :key="match.id">
          <template v-if="match.localTeam || match.guestTeam">
            <td>{{ match.localTeam }}</td>
            <td>{{ match.guestTeam }}</td>
          </template>
          <template v-else>
            <td colspan="2">{{ match.name }}</td>
          </template>
          <td>{{ match.gameMap }}</td>
          <td>{{ match.gametype }}</td>
          <td>
            {{ match.status }}<br />
            <template v-if="match.scheduledStartTs">
              <span class="small">{{ match.scheduledStartTs }}</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Match } from "@/model/Match";

@Component
export default class PaneMatches extends Vue {
  @Prop({ required: true })
  gameTag!: string;

  @Prop({ required: true })
  matchList!: Match[];
}
</script>

<style scoped lang="scss">
table thead th {
  border: 0;
}
</style>
