<template>
  <div class="p-2 border border-gray-500 mt-4">
    <client-only>
      <!--    {{ amount }}-->
      <PolarArea
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
    totalDeposit: {
      type: String,
      default: "0",
    },
    minDeposit: {
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
      default: 300,
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
  computed: {
    chartData() {
      return {
        labels: ["Total deposit", "Deposit Remaining"],
        datasets: [
          {
            label: "test",
            data: [
              this.totalDeposit / 1000000,
              this.minDeposit / 1000000 - this.total_deposit / 1000000,
            ],
            backgroundColor: ["#33ffc9", "#00b383", "#00b383", "#004d38"],
            //borderColor: '#00b786',
            borderWidth: 0,
          },
        ],
      };
    },
  },
};
</script>
