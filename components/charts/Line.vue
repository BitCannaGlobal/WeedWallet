<template>
  <Line
    v-if="loaded"
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
    :width="300"
    :height="70"
  />
</template>

<script>
import axios from "axios";
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, PointElement, LineElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar, Line },
  data() {
    return {
      loaded: false,
      chartData: null,
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        animation: {
          duration: 0,
        },
      }
    }
  },
  async mounted() {
    this.loaded = false
    try {
 

      const full = await axios("/api/market-chart");

      const copyItems = [];
      const copyDates = [];
      full.data.getMarket.forEach((item) => {
        const dateFormat = new Date(item.time * 1000);
        const finalDate =
          dateFormat.getDate() +
          "/" +
          (dateFormat.getMonth() + 1) +
          "/" +
          dateFormat.getFullYear();

        copyItems.push(item.close);
        copyDates.push(finalDate);
      });

      console.log('copyItems', copyItems)
      console.log('copyDates', copyDates)
      const dataChart = {
        labels: copyDates,
        datasets: [
          {
            borderColor: "#0EA674",
            // borderDash: [5, 5],
            backgroundColor: "#e755ba",
            pointBackgroundColor: "#0EA674",
            pointBorderColor: "#0EA674",
            pointHoverBackgroundColor: "#0EA674",
            pointHoverBorderColor: "#0EA674",
            data: copyItems
          },
        ],
      };
      this.chartData = dataChart 
      this.loaded = true
    } catch (e) {
        console.error(e)
    }
  }
}
</script>