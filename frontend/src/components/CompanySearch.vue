<template>
  <div class="p-6 max-w-2xl mx-auto bg-white rounded-md shadow-md">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Rechercher des personnes par entreprise</h2>
    <form @submit.prevent="searchByCompany" class="space-y-4">
      <div>
        <label for="company" class="block text-gray-700 font-medium mb-1">Nom de l'entreprise :</label>
        <input
          id="company"
          v-model="company"
          placeholder="Entrez une entreprise"
          required
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Rechercher
      </button>
    </form>

    <div v-if="loading" class="text-center text-gray-500">Chargement en cours...</div>
    <ul v-else-if="persons.length > 0" class="space-y-4">
      <li v-for="person in persons" :key="person.id" class="border p-4 rounded-md shadow-sm bg-gray-50">
        <p class="font-semibold text-gray-800">
          {{ person.lastname }} {{ person.firstname }}
        </p>
        <ul class="pl-4 mt-2 space-y-2">
          <li
            v-for="job in person.jobs"
            :key="job.id"
            class="text-gray-600"
          >
            {{ job.company }} - {{ job.position }}
            (Du {{ formatDate(job.startDate) }} au
            {{ job.endDate ? formatDate(job.endDate) : "Présent" }})
          </li>
        </ul>
      </li>
    </ul>
    <p v-else-if="hasSearched" class="text-center text-gray-500">Aucune personne trouvée pour cette entreprise.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  setup() {
    const company = ref<string>("");
    const persons = ref<any[]>([]);
    const loading = ref<boolean>(false);
    const hasSearched = ref<boolean>(false);

    const formatDate = (date: string | null): string => {
      if (!date) return "N/A";
      return new Date(date).toISOString().split("T")[0];
    };

    const searchByCompany = async () => {
      loading.value = true;
      hasSearched.value = true;
      try {
        const response = await axios.get(
          `http://localhost:3000/persons/by-company/${company.value}`
        );
        persons.value = response.data;
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        persons.value = [];
      } finally {
        loading.value = false;
      }
    };

    return {
      company,
      persons,
      loading,
      hasSearched,
      searchByCompany,
      formatDate,
    };
  },
});
</script>
