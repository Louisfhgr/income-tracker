<template>
  <div class="container">
    <h1>Haushaltsbudget</h1>
    <p v-if="user">Angemeldet als: {{ user.email }}</p>
    <p v-else>Bitte melden Sie sich an.</p>

    <!-- Gesamtbetrag anzeigen -->
    <h2 v-if="user">Gesamteinkommen: {{ totalIncome }} €</h2>

    <!-- Formular zum Hinzufügen oder Bearbeiten von Einnahmen -->
    <form @submit.prevent="isEditing ? updateIncome() : addIncome()" v-if="user">
      <input v-model="amount" type="number" placeholder="Betrag" required />
      <input v-model="source" type="text" placeholder="Quelle" required />
      <button type="submit">{{ isEditing ? 'Aktualisieren' : 'Hinzufügen' }}</button>
      <button @click="cancelEdit" type="button" v-if="isEditing">Abbrechen</button>
    </form>

    <!-- Filteroptionen -->
    <div v-if="user" class="filter-container">
      <!-- Filter nach Quelle -->
      <div class="filter-item">
        <label for="sourceFilter">Quelle:</label>
        <select v-model="selectedSource" @change="updateChart">
          <option value="">Alle</option>
          <option v-for="source in uniqueSources" :key="source" :value="source">{{ source }}</option>
        </select>
      </div>

      <!-- Filter nach Datum -->
      <div class="filter-item">
        <label for="dateFilter">Datum:</label>
        <select v-model="selectedDate" @change="updateChart">
          <option value="">Alle</option>
          <option v-for="date in uniqueDates" :key="date" :value="date">{{ new Date(date).toLocaleDateString() }}</option>
        </select>
      </div>

      <!-- Filter nach Anzahl der Einträge -->
      <div class="filter-item">
        <label for="entryCount">Anzahl der Einträge:</label>
        <input v-model.number="entryCount" type="number" min="1" placeholder="Anzahl der Einträge" @input="updateChart" />
      </div>
    </div>

    <!-- Container für Tabelle und Diagramm -->
    <div class="content-container" v-if="user">
      <!-- Tabelle der letzten Einnahmen -->
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
            <tr v-for="income in displayedIncomes" :key="income.id">
              <td>{{ income.amount }}</td>
              <td>{{ income.source }}</td>
              <td>{{ new Date(income.created_at).toLocaleString() }}</td>
              <td>
                <button @click="startEdit(income)">Bearbeiten</button>
                <button @click="deleteIncome(income.id)">Löschen</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Diagramm der Einnahmen -->
      <div class="chart-container">
        <canvas id="incomeChart"></canvas>
      </div>
    </div>
  </div>
  <!-- Abmeldebutton -->
  <button @click="logout" v-if="user">Logout</button>
</template>

<script setup>
// Importiere die notwendigen Module und Hooks von Vue
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import { useNuxtApp } from '#app'
import { useRouter } from 'vue-router'

// Definiere die notwendigen Referenzen und Variablen
const incomes = ref([])
const amount = ref(0)
const source = ref('')
const selectedSource = ref('')
const selectedDate = ref('')
const user = ref(null)
const isEditing = ref(false)
const editIncomeId = ref(null)
const entryCount = ref(5)  // Neue Variable für die Anzahl der Einträge

// Zugriff auf Supabase und Router
const { $supabase } = useNuxtApp()
const router = useRouter()

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

// Computed Property für die angezeigten Einträge basierend auf der festgelegten Anzahl
const displayedIncomes = computed(() => {
  return filteredIncomes.value.slice(-entryCount.value)
})

// Computed Property für das Gesamteinkommen
const totalIncome = computed(() => {
  return incomes.value.reduce((sum, income) => sum + income.amount, 0)
})

// Computed Property für kumulative Daten zum Diagramm
const cumulativeIncomes = computed(() => {
  const cumulativeData = []
  let cumulativeSum = 0
  for (const income of filteredIncomes.value) {
    cumulativeSum += income.amount
    cumulativeData.push({ date: new Date(income.created_at), amount: cumulativeSum })
  }
  return cumulativeData
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
  console.log('Aktualisiere das Diagramm mit folgenden Daten:', cumulativeIncomes.value)

  const labels = cumulativeIncomes.value.map(income => income.date)
  const data = cumulativeIncomes.value.map(income => income.amount)

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

// Funktion zum Starten der Bearbeitung eines Einkommensdatensatzes
const startEdit = (income) => {
  isEditing.value = true
  editIncomeId.value = income.id
  amount.value = income.amount
  source.value = income.source
}

// Funktion zum Abbrechen der Bearbeitung
const cancelEdit = () => {
  isEditing.value = false
  editIncomeId.value = null
  amount.value = 0
  source.value = ''
}

// Funktion zum Aktualisieren von Einkommensdaten
const updateIncome = async () => {
  if (!user.value || !editIncomeId.value) return

  const { error } = await $supabase
    .from('incomes')
    .update({ amount: amount.value, source: source.value })
    .eq('id', editIncomeId.value)
    .eq('user_id', user.value.id)
  
  if (!error) {
    const index = incomes.value.findIndex(income => income.id === editIncomeId.value)
    if (index !== -1) {
      incomes.value[index].amount = amount.value
      incomes.value[index].source = source.value
    }
    console.log('Einkommen erfolgreich aktualisiert:', editIncomeId.value)
    fetchIncomes() // Nach dem Aktualisieren Daten erneut abrufen und sortieren
    cancelEdit()
  } else {
    console.error('Fehler beim Aktualisieren der Einnahmen:', error)
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

// Funktion zum Abmelden
const logout = async () => {
  const { error } = await $supabase.auth.signOut()
  if (error) {
    console.error('Fehler beim Abmelden:', error)
  } else {
    user.value = null
    router.push('/')
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
