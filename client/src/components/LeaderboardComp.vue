<template>
  <div class="leaderboard-scroll-bg">
    <br>
    <h2 class="leaderboard_label" style="font-family: BioRhyme; color:#3a533a"><i class="bi bi-dpad-fill"></i> Leaderboard</h2>
    <div class="leaderboard-scroll-div">
      <div class="leaderboard-scroll-object">
        <table class="main-leaderboard">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(leader, index) in leaderboard" :key="leader.username">
            <td>{{ index + 1 }}</td>
            <td>{{ leader.username }}</td> 
            <td>{{ leader.time_taken }}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>
  
<script>
import { getPuzzleUsers } from '@/services/PuzzleService';

export default {
  data() {
    return {
      leaderboard: []
    }
  },
  mounted() {
    let puzzle_id = this.$parent.$props.puzzle_id;
    getPuzzleUsers(puzzle_id).then((res) => {

      if (res.success) {
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          let time = data[i].time_taken;
          let ms = time % 1000;
          let s = Math.floor(time / 1000);
          let m = Math.floor(s / 60);
          s = s % 60;
          let h = Math.floor(m / 60);
          m = m % 60;

          let hours = h < 10 ? "0" + h : h;
          let minutes = m < 10 ? "0" + m : m;
          let seconds = s < 10 ? "0" + s : s;
          let milliseconds = ms < 10 ? "00" + ms : ms < 100 ? "0" + ms : ms;

          let t = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
          this.leaderboard.push({ 'username': data[i].username, 'time_taken': t });
        }
      }
      else {
        this.leaderboard.push({ 'username': "No times recorded", 'time_taken': '' });
      }
    });
  }
};

</script>
<style>
.l-col-3 {
  padding: 10%;
}

.leaderboard-scroll-bg {
  /* margin-left: 67%; */
  width: 100%;
  border-radius: 15px;
  background-color: #ccd5ae;
  padding-bottom: 3%;
}

.leaderboard-scroll-div {
  margin: auto;
  width: 95%;
  background: #e9edc9;
  overflow: hidden;
  overflow-y: scroll;
  border-radius: 15px;
  font-family: BioRhyme;
  color: #3a533a;
}

.leaderboard-scroll-object {
  padding: 10px;
}

.main-leaderboard {
  width: 100%;
}

.main-leaderboard th {
  border-bottom: 2px solid #3a533a;
}
</style>