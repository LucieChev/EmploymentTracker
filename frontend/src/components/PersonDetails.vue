<template>
  <div
    v-if="person"
    class="p-6 bg-white rounded-md shadow-lg max-w-6xl mx-auto flex flex-col md:flex-row gap-6"
  >
    <div class="flex-1">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">
        Détails de {{ person.lastname }} {{ person.firstname }}
      </h2>
      <div>
        <p class="text-gray-700">
          <strong>Nom :</strong> {{ person.lastname }}
        </p>
        <p class="text-gray-700">
          <strong>Prénom :</strong> {{ person.firstname }}
        </p>
        <p class="text-gray-700">
          <strong>Date de naissance :</strong> {{ person.birthdate }}
        </p>
      </div>

      <div class="mt-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Emplois</h3>
        <ul v-if="person.jobs && person.jobs.length > 0" class="space-y-2">
          <li
            v-for="job in person.jobs"
            :key="job.id"
            class="bg-gray-100 p-4 rounded-md shadow-sm"
          >
            <span class="font-medium text-gray-800">{{ job.company }}</span> :
            <span class="italic">{{ job.position }}</span> -
            <span class="text-sm">
              Du <span class="text-gray-800">{{ job.startDate }}</span> au
              <span :class="job.endDate ? 'text-gray-800' : 'text-green-500'">
                {{ job.endDate || "Présent" }}
              </span>
            </span>
          </li>
        </ul>
        <p v-else class="text-gray-500">Aucun emploi trouvé.</p>
        <div class="flex justify-center mt-4">
          <button
            @click="addJob(person.id)"
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Ajouter un emploi
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        Rechercher les emplois par date
      </h3>
      <form @submit.prevent="searchJobs" class="space-y-4">
        <div class="flex flex-col justify-center sm:flex-row sm:items-center gap-4">
          <div class="flex flex-col">
            <label for="startDate" class="text-gray-700 font-medium"
              >Date de début :</label
            >
            <input
              id="startDate"
              v-model="startDate"
              type="date"
              required
              class="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div class="flex flex-col">
            <label for="endDate" class="text-gray-700 font-medium"
              >Date de fin :</label
            >
            <input
              id="endDate"
              v-model="endDate"
              type="date"
              required
              class="border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Appliquer le filtre
          </button>
        </div>
      </form>

      <div v-if="hasSearched ">
        <div v-if="jobs.length > 0" class="mt-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            Résultats du filtre
          </h3>
          <ul class="space-y-2">
            <li
              v-for="job in jobs"
              :key="job.id"
              class="bg-gray-100 p-4 rounded-md shadow-sm"
            >
              <span class="font-medium text-gray-800">{{ job.company }}</span> -
              <span class="italic">{{ job.position }}</span>
              (Du {{ job.startDate }} au
              {{ job.endDate ? job.endDate : "Présent" }})
            </li>
          </ul>
        </div>
        <div v-if="hasSearched && jobs.length === 0">
  <p class="text-gray-500 mt-4">
    Aucun emploi trouvé pour cette plage de dates.
  </p>
</div>
      </div>
    </div>
  </div>

  <div v-else class="text-center mt-12">
    <p class="text-gray-500">Chargement en cours...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { PersonAttributes } from "../types/Person";

export default defineComponent({
  setup() {
    const person = ref<PersonAttributes | null>(null);
    const jobs = ref<any[]>([]);
    const startDate = ref<string>("");
    const endDate = ref<string>("");
    const hasSearched = ref(false);
    const route = useRoute();
    const router = useRouter();

    const fetchPersonDetails = async () => {
      try {
        const id = route.params.id;
        const response = await axios.get(`http://localhost:3000/persons/${id}`);
        person.value = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des détails :", error);
      }
    };

    const searchJobs = async () => {
  hasSearched.value = true;

  if (!startDate.value || !endDate.value) {
    console.error("Les dates de début et de fin sont requises.");
    return;
  }

  try {
    const id = route.params.id;
    const response = await axios.get(
      `http://localhost:3000/persons/${id}/jobs`,
      {
        params: {
          startDate: startDate.value,
          endDate: endDate.value,
        },
      }
    );

    jobs.value = response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des emplois :", error);
    jobs.value = [];
  }
};    const addJob = (id: string) => {
      router.push(`/jobs/add?personId=${id}`);
    };

    onMounted(() => {
      fetchPersonDetails();
    });

    return { person, jobs, startDate, endDate, searchJobs, addJob, hasSearched };
  },
});
</script>
