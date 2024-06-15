<template>
  <div>
    <h1>Einkommen</h1>
    <form @submit.prevent="addIncome">
      <input v-model="amount" type="number" placeholder="Betrag" required />
      <input v-model="source" type="text" placeholder="Quelle" required />
      <button type="submit">Hinzufügen</button>
    </form>

    <div>
      <label for="sourceFilter">Quelle:</label>
      <select v-model="selectedSource" @change="updateChart">
        <option value="">Alle</option>
        <option v-for="source in uniqueSources" :key="source" :value="source">{{ source }}</option>
      </select>

      <label for="dateFilter">Datum:</label>
      <select v-model="selectedDate" @change="updateChart">
        <option value="">Alle</option>
        <option v-for="date in uniqueDates" :key="date" :value="date">{{ new Date(date).toLocaleDateString() }}</option>
      </select>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Betrag</th>
            <th>Quelle</th>
            <th>Datum</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="income in lastFiveIncomes" :key="income.id">
            <td>{{ income.amount }}</td>
            <td>{{ income.source }}</td>
            <td>{{ new Date(income.created_at).toLocaleString() }}</td>
            <td>
              <button @click="deleteIncome(income.id)">Löschen</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <canvas id="incomeChart" width="400" height="200"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import { useNuxtApp } from '#app'

// Referenzen für die Daten und die Eingabe
const incomes = ref([])
const amount = ref(0)
const source = ref('')
const selectedSource = ref('')
const selectedDate = ref('')
const user = ref(null)

// Zugriff auf Supabase aus dem Nuxt App Kontext
const { $supabase } = useNuxtApp()

// Funktion zum Abrufen des aktuellen Benutzers
const fetchUser = async () => {
  const { data, error } = await $supabase.auth.getSession()
  if (error) {
    console.error('Fehler beim Abrufen der Benutzersitzung:', error)
  } else if (data.session) {
    user.value = data.session.user
    console.log('Benutzer eingeloggt:', user.value)
    fetchIncomes()
  } else {
    console.error('Keine aktive Sitzung gefunden')
  }
}

// Funktion zum Abrufen der Einkommensdaten
const fetchIncomes = async () => {
  if (!user.value) return

  const { data, error } = await $supabase
    .from('incomes')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: true }) // Daten nach Datum sortieren

  if (!error) {
    incomes.value = data
    console.log('Einkommensdaten abgerufen und sortiert:', incomes.value)
    updateChart()
  } else {
    console.error('Fehler beim Abrufen der Einnahmen:', error)
  }
}

// Computed Property für gefilterte Daten
const filteredIncomes = computed(() => {
  return incomes.value.filter(income => {
    const matchesSource = selectedSource.value === '' || income.source === selectedSource.value
    const matchesDate = selectedDate.value === '' || income.created_at.startsWith(selectedDate.value)
    return matchesSource && matchesDate
  })
})

// Computed Property für die letzten fünf Einträge
const lastFiveIncomes = computed(() => {
  const end = filteredIncomes.value.length
  const start = end > 5 ? end - 5 : 0
  return filteredIncomes.value.slice(start, end)
})

// Computed Property für einzigartige Quellen
const uniqueSources = computed(() => {
  return [...new Set(incomes.value.map(income => income.source))]
})

// Computed Property für einzigartige Daten
const uniqueDates = computed(() => {
  return [...new Set(incomes.value.map(income => new Date(income.created_at).toISOString().split('T')[0]))]
})

// Funktion zum Aktualisieren des Diagramms
const updateChart = () => {
  console.log('Aktualisiere das Diagramm mit folgenden Daten:', filteredIncomes.value)

  const labels = filteredIncomes.value.map(income => new Date(income.created_at))
  const data = filteredIncomes.value.map(income => income.amount)

  console.log('Labels für das Diagramm:', labels)
  console.log('Daten für das Diagramm:', data)

  const ctx = document.getElementById('incomeChart')
  if (!ctx) {
    console.error('Canvas-Element mit ID "incomeChart" nicht gefunden')
    return
  }

  const chartCtx = ctx.getContext('2d')
  if (Chart.getChart(chartCtx)) {
    Chart.getChart(chartCtx).destroy()
  }

  new Chart(chartCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Einkommen',
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

// Watcher für gefilterte Daten, um das Diagramm zu aktualisieren
watch(filteredIncomes, updateChart)

// Funktion zum Hinzufügen neuer Einkommensdaten
const addIncome = async () => {
  if (!user.value) return

  const { data, error } = await $supabase
    .from('incomes')
    .insert([{ amount: amount.value, source: source.value, user_id: user.value.id }])
  
  if (!error) {
    incomes.value.push(data[0])
    console.log('Einkommen erfolgreich hinzugefügt:', data)
    fetchIncomes() // Nach dem Hinzufügen Daten erneut abrufen und sortieren
    amount.value = 0
    source.value = ''
  } else {
    console.error('Fehler beim Hinzufügen der Einnahmen:', error)
  }
}

// Funktion zum Löschen von Einkommensdaten
const deleteIncome = async (id) => {
  if (!user.value) return

  const { error } = await $supabase
    .from('incomes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.value.id)
  
  if (!error) {
    incomes.value = incomes.value.filter(income => income.id !== id)
    console.log('Einkommen erfolgreich gelöscht:', id)
    fetchIncomes() // Nach dem Löschen Daten erneut abrufen und sortieren
  } else {
    console.error('Fehler beim Löschen der Einnahmen:', error)
  }
}

// Lifecycle Hooks zum Abrufen der Daten und Einrichten der Realtime-Subscription
onMounted(() => {
  fetchUser()
  const subscription = $supabase
    .channel('public:incomes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'incomes' }, payload => {
      console.log('Änderung empfangen:', payload)
      fetchIncomes()
    })
    .subscribe()

  onUnmounted(() => {
    $supabase.removeChannel(subscription)
  })
})
</script>

<style scoped>
.table-container {
  max-height: 200px; /* Feste Höhe für den Tabellenkörper */
  overflow-y: auto; /* Ermöglicht das vertikale Scrollen */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 10px;
  text-align: left;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

label {
  margin-right: 10px;
}

select {
  margin-right: 20px;
}
</style>
