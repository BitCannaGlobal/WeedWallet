<template>
  <div v-if="loaded" class="p-2 border border-gray-500 mt-4">

      <BarChart
        :width="width"
        :height="height"
        :data="pricedata"

      />

  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    chartId: {
      type: String,
      default: 'doughnut-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    pricedata: '',
    loaded: false
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
  async mounted () {

    // const full = await useFetch('https://api.coingecko.com/api/v3/coins/bitcanna/market_chart?vs_currency=usd&days=7') // &interval=daily
    const full = await axios('https://api.coingecko.com/api/v3/coins/bitcanna/market_chart?vs_currency=usd&days=7')

    let copyItems = []
    let copyDates = []
    full.data.prices.forEach((item) => {

      var dateFormat= new Date(item[0]);
      let finalDate = dateFormat.getDate()+
          "/"+(dateFormat.getMonth()+1)+
          "/"+dateFormat.getFullYear()+
          " "+dateFormat.getHours()+
          ":"+dateFormat.getMinutes()+
          ":"+dateFormat.getSeconds()

      copyItems.push(item[1]);
      copyDates.push(finalDate);
    })
    const dataChart =  {
      labels: copyDates,
      datasets: [
        {
          label: 'Price $',
          backgroundColor: '#0EA674',
          borderColor: 'gray',
          // data: [40, 39, 10, 40, 39, 80, 40]
          // data: [{x: new Date(1673715781154).toLocaleDateString("en-US"), y: 20}, {x: new Date(1673719386839).toLocaleDateString("en-US"), y: 10}]
          data: copyItems
        }
      ]
    }
    const options = {
      responsive: true,
      maintainAspectRatio: false
    }
    this.pricedata = dataChart
    this.loaded = true
  },
}
</script>
