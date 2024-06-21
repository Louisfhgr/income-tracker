<template>
    <div class="chart-container">
      <canvas ref="incomeChart"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import Chart from 'chart.js/auto'
  import 'chartjs-adapter-date-fns'
  
  const props = defineProps({
    cumulativeIncomes: Array
  })
  
  const chartInstance = ref(null)
  const incomeChart = ref(null)
  
  const createChart = () => {
    if (!incomeChart.value) return
  
    const ctx = incomeChart.value.getContext('2d')
    if (chartInstance.value) {
      chartInstance.value.destroy()
    }
  
    const labels = props.cumulativeIncomes.map(income => income.date)
    const data = props.cumulativeIncomes.map(income => income.amount)
  
    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Kumulatives Einkommen',
          data: data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
  
  watch(() => props.cumulativeIncomes, createChart)
  
  onMounted(createChart)
  onBeforeUnmount(() => {
    if (chartInstance.value) {
      chartInstance.value.destroy()
    }
  })
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 400px;
    width: 100%;
  }
  </style>
  