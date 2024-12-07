<template>
  <div class="p-4">
    <!-- Si la liste est vide -->
    <div v-if="persons.length === 0" class="text-center">
      <p class="text-gray-500 mb-4">Aucune personne trouvée.</p>
      <button
        @click="addPerson"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Ajouter une personne
      </button>
    </div>

    <!-- Vue mobile (cartes) -->
    <div v-else class="grid grid-cols-1 gap-4 sm:hidden">
      <div
        v-for="person in persons"
        :key="person.id"
        class="border border-gray-300 rounded-md shadow-md p-4 bg-white"
      >
        <h3 class="text-xl font-bold text-blue-500 mb-2">
          {{ person.lastname }} {{ person.firstname }}
        </h3>
        <p class="text-gray-700">
          <strong>Date de naissance :</strong> {{ person.birthdate }}
        </p>
        <p class="text-gray-700">
          <strong>Âge :</strong> {{ person.age }} ans
        </p>
        <p v-if="person.currentJob" class="text-gray-700">
          <strong>Emploi actuel :</strong> {{ person.currentJob.company }} - {{ person.currentJob.position }}
        </p>
        <p v-else class="text-gray-500">Aucun emploi en cours.</p>
        <button
          @click="viewDetails(person.id)"
          class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Voir détails
        </button>
      </div>
    </div>

    <!-- Vue desktop (tableau) -->
    <div v-else class="hidden sm:block overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300">
        <caption class="text-lg font-semibold text-gray-700 mb-4">
          Liste complète des personnes
        </caption>
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Nom</th>
            <th class="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Prénom</th>
            <th class="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
              Date de naissance
            </th>
            <th class="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Âge</th>
            <th class="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
              Emploi actuel
            </th>
            <th class="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in persons" :key="person.id" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2">{{ person.lastname }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ person.firstname }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ person.birthdate }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ person.age }} ans</td>
            <td class="border border-gray-300 px-4 py-2">
              <span v-if="person.currentJob">
                {{ person.currentJob.company }} - {{ person.currentJob.position }}
              </span>
              <span v-else class="text-gray-500">Aucun emploi en cours.</span>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <button
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                @click="viewDetails(person.id)"
              >
                Voir détails
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { PersonAttributes } from "../types/Person"; 
import { JobAttributes } from "../types/Job";

export default defineComponent({
  setup() {
    const persons = ref<
      (PersonAttributes & { age: number; currentJob?: JobAttributes | null })[]
    >([]);
    const router = useRouter();

    const calculateAge = (birthdate: Date): number => {
      const birthDate = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const sortPersons = (a: PersonAttributes, b: PersonAttributes): number => {
      const lastnameComparison = a.lastname.localeCompare(b.lastname);
      if (lastnameComparison !== 0) return lastnameComparison;
      return a.firstname.localeCompare(b.firstname);
    };

    const fetchPersons = async (): Promise<void> => {
      try {
        const response = await axios.get<PersonAttributes[]>(
          "http://localhost:3000/persons"
        );
        persons.value = response.data
          .map((person) => ({
            ...person,
            age: calculateAge(person.birthdate),
            currentJob: person.jobs?.find((job) => !job.endDate) || null,
          }))
          .sort(sortPersons);
      } catch (error) {
        console.error("Erreur lors de la récupération des personnes :", error);
      }
    };

    const viewDetails = (id: string): void => {
      router.push(`/persons/${id}`);
    };

    const addPerson = (): void => {
      router.push("/persons/add");
    };

    onMounted(() => {
      fetchPersons();
    });

    return { persons, viewDetails, addPerson };
  },
});
</script>
