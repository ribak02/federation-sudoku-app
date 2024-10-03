<template>
    <br />
    <div id="box">
        <div class="stopwatch" id="stopwach">
            <p style="background-color: #fefae0;">00:00:00</p>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        start: function () {
            let [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
            let timerRef = document.querySelector(".stopwatch");
            let int = null;

            if (int !== null) {
                clearInterval(int);
            }
            int = setInterval(time, 10);

            function time() {
                milliseconds += 10;
                if (milliseconds == 1000) {
                    milliseconds = 0;
                    seconds++;
                    if (seconds == 60) {
                        seconds = 0;
                        minutes++;
                        if (minutes == 60) {
                            minutes = 0;
                            hours++;
                        }
                    }
                }
                let h = hours < 10 ? "0" + hours : hours;
                let m = minutes < 10 ? "0" + minutes : minutes;
                let s = seconds < 10 ? "0" + seconds : seconds;
                let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
                timerRef.innerHTML = ` ${h} : ${m} : ${s} : ${ms}`;
            }
        }
    },
    mounted() {
        try {
            this.start();
        } catch (e) {
            console.log(e);
        }
    }
}
</script>
<style scoped>
.stopwatch {
    color: #3a533a;
    font-family: BioRhyme;
    font-weight: bolder;
    font-size: xx-large;
    margin-bottom: 20px;
}
</style>