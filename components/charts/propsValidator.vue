<template>
  <div class="p-2 border border-gray-500">
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
export default {
  props: {
    totalProps: {
      type: String,
      default: "0",
    },
    totalVoted: {
      type: String,
      default: "0",
    },
    chartId: {
      type: String,
      default: "doughnut-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 200,
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
  computed: {
    chartData() {
      return {
        labels: ["Voted", "Not voted"],
        datasets: [
          {
            label: "test",
            data: [this.totalVoted, this.totalProps - this.totalVoted],
            backgroundColor: ["#33ffc9", "#00b383"],
            //borderColor: '#00b786',
            borderWidth: 2,
          },
        ],
      };
    },
  },
};
</script>
