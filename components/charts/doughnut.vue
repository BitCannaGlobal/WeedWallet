<template>
  <div class="p-2 border border-gray-500 mt-4">

    <client-only>
<!--    {{ amount }}-->
      <Doughnut
        :data="chartData"
        :width="width"
        :height="height"
      />
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {

  props: {
    amount: {
      type: Number,
      default: '0'
    },
    totalDelegated: {
      type: String,
      default: '0'
    },
    totalUnbound: {
      type: String,
      default: '0'
    },
    rewardsDoughnut: {
      type: String,
      default: '0'
    },
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
  computed: {
    chartData() {
      console.log(this.amount)
      return {
        labels: ['Available', 'Delegated', 'Undelegated', 'Reward'],
        datasets: [
          {
            label: 'test',
            data: [this.amount / 1000000, this.totalDelegated / 1000000, this.totalUnbound, this.rewardsDoughnut / 1000000 ],
            backgroundColor: [
              '#b3ffeb',
              '#33ffc9',
              '#00b383',
              '#004d38'
            ],
            borderColor: '#00b786',
            borderWidth: 2,
          },
        ],
      }
    },
  },
}
</script>
