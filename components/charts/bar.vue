<template>
  <div>
    <v-skeleton-loader
      v-if="firstLoad"
      :loading="loading"
      type="image"
    />
    <div
      v-if="loaded"
      class="p-2 border border-gray-500 mt-4"
    >
      <Line
        :width="width"
        :height="height"
        :data="pricedata"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

//ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


export default {
  components: { Line },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 300,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    pricedata: "",
    loaded: false,
    loading: true,
    firstLoad: true,
  }),
  /*computed: {
    chartData() {



      return {
        labels: [1, 2, 3, 4, 5],
        datasets: [
          {
            label: 'test',
            data: pricedata,
            backgroundColor: '007050',
            borderColor: '#00b786',
            borderWidth: 2,
          },
        ],
      }
    },
  },*/
  async mounted() {
    // const full = await useFetch('https://api.coingecko.com/api/v3/coins/bitcanna/market_chart?vs_currency=usd&days=7') // &interval=daily
    // const full = await axios('https://api.coingecko.com/api/v3/coins/bitcanna/market_chart?vs_currency=usd&days=7&interval=daily')
    const full = await axios("api/market-chart");

    const copyItems = [];
    const copyDates = [];
    /* full.data.prices.forEach((item) => {

      var dateFormat= new Date(item[0]);
      
      let finalDate = 
          dateFormat.getDate()+
          "/"+(dateFormat.getMonth()+1)+
          "/"+dateFormat.getFullYear() 
          //" "+dateFormat.getHours()+
          //":"+dateFormat.getMinutes()+
          //":"+dateFormat.getSeconds()

      copyItems.push(item[1]);
      copyDates.push(finalDate);
    }) */
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
    const dataChart = {
      labels: copyDates,
      datasets: [
        {
          lineTension: 0.5,
          borderColor: "#0EA674",
          data: copyItems,
        },
      ],
    };
    this.pricedata = dataChart;
    this.loaded = true;
    this.loading = false;
    this.firstLoad = false;
  },
};
</script>
