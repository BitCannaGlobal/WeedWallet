import Vue from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'

Vue.component('BarChart', {
  extends: Bar,
  props: {
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
        },
      }),
    },
  },
  watch: {
    data() {
      this.renderChart(this.data, this.options)
    },
  },
  mounted() {
    this.renderChart(this.data, this.options)
  },
})

Vue.component('Doughnut', {
  extends: Doughnut,
  props: {
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
        },
      }),

    },
  },
  watch: {
    data() {
      this.renderChart(this.data, this.options)
    },
  },
  mounted() {
    this.renderChart(this.data, this.options)
  },
})
