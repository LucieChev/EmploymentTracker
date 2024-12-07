<template>
  <div class="p-6 max-w-lg mx-auto bg-white rounded-md shadow-md relative">
    <button
      @click="goBack"
      class="absolute top-4 left-4 text-blue-500 hover:text-blue-600 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Ajouter un emploi</h2>
    <form @submit.prevent="addJob" class="space-y-4">
      <input v-model="personId" type="hidden" />

      <div>
        <label for="company" class="block text-gray-700 font-medium mb-1">Entreprise :</label>
        <input
          id="company"
          v-model="company"
          required
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label for="position" class="block text-gray-700 font-medium mb-1">Poste :</label>
        <input
          id="position"
          v-model="position"
          required
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label for="startDate" class="block text-gray-700 font-medium mb-1">Date de début :</label>
        <input
          id="startDate"
          v-model="startDate"
          type="date"
          :max="today"
          required
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p v-if="errors.startDate" class="text-red-500 text-sm mt-1">{{ errors.startDate }}</p>
      </div>

      <div>
        <label for="endDate" class="block text-gray-700 font-medium mb-1">Date de fin :</label>
        <input
          id="endDate"
          v-model="endDate"
          type="date"
          :min="startDate"
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p v-if="errors.endDate" class="text-red-500 text-sm mt-1">{{ errors.endDate }}</p>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Ajouter
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const personId = ref(route.query.personId || "");
    const company = ref("");
    const position = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const errors = ref<{ startDate?: string; endDate?: string }>({});
    const today = ref(new Date().toISOString().split("T")[0]); 

    const validateDates = (): boolean => {
      errors.value = {}; 
      let isValid = true;

      if (startDate.value && startDate.value > today.value) {
        errors.value.startDate = "La date de début ne peut pas être après la date du jour.";
        isValid = false;
      }

      if (endDate.value && endDate.value < startDate.value) {
        errors.value.endDate = "La date de fin ne peut pas être avant la date de début.";
        isValid = false;
      }

      return isValid;
    };

    const addJob = async () => {
      if (!validateDates()) return;

      try {
        await axios.post("http://localhost:3000/jobs", {
          personId: personId.value,
          company: company.value,
          position: position.value,
          startDate: startDate.value,
          endDate: endDate.value || null,
        });
        toast.success("Emploi ajouté avec succès !", {
          onClose: () => {
            router.push(`/persons/${personId.value}`);
          },
        });
      } catch (err) {
        console.error("Erreur :", err);
        toast.error("Une erreur s'est produite lors de l'ajout de l'emploi.");
      }
    };

    const goBack = () => {
      router.push(`/persons/${personId.value}`);
    };

    return {
      personId,
      company,
      position,
      startDate,
      endDate,
      today,
      errors,
      addJob,
      goBack,
    };
  },
});
</script>
