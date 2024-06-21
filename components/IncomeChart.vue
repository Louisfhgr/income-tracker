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
  
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)')
    gradient.addColorStop(1, 'rgba(75, 192, 192, 0)')
  
    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Einkommensverlauf',
          data: data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#333',
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            cornerRadius: 5,
            xPadding: 10,
            yPadding: 10
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'DD MMM YYYY'
            },
            ticks: {
              color: '#333',
              font: {
                size: 12
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#333',
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.3)'
            }
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
  