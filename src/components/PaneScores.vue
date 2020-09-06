<template>
  <div class="container-fluid">
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th scope="col" class="sticky-top bg-dark">Team</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in teamList" :key="team.id">
          <td>{{ team.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Team } from "@/model/Team";

@Component
export default class PaneScores extends Vue {
  @Prop({ required: true })
  gameTag!: string;

  @Prop({ required: true })
  teamList!: Team[];
}
</script>

<style scoped lang="scss">
table thead th {
  border: 0;
}
</style>
