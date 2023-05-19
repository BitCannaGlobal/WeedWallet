import Vue from "vue";
import { Bar, Doughnut, Line, PolarArea, Radar } from "vue-chartjs";

Vue.component("LineChart", {
  extends: Line,
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
          display: false,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        animation: {
          duration: 0,
        },
      }),
    },
  },
  watch: {
    data() {
      this.renderChart(this.data, this.options);
    },
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
});

Vue.component("BarChart", {
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
        animation: {
          duration: 0,
        },
      }),
    },
  },
  watch: {
    data() {
      this.renderChart(this.data, this.options);
    },
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
});

Vue.component("Doughnut", {
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
          display: false,
        },
        animation: {
          duration: 0,
        },
      }),
    },
  },
  watch: {
    data() {
      this.renderChart(this.data, this.options);
    },
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
});

Vue.component("PolarArea", {
  extends: PolarArea,
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
          display: false,
        },
      }),
    },
  },
  watch: {
    data() {
      this.renderChart(this.data, this.options);
    },
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
});
Vue.component("Radar", {
  extends: Radar,
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
          display: false,
        },
      }),
    },
  },
  watch: {
    data() {
      this.renderChart(this.data, this.options);
    },
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
});
