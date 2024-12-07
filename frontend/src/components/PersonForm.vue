<template>
  <div class="p-6 max-w-lg mx-auto bg-white rounded-md shadow-md">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Ajouter une personne</h2>
    <form @submit.prevent="savePerson" class="space-y-4">
      <div>
        <label for="firstname" class="block text-gray-700 font-medium mb-1">Prénom :</label>
        <input
          id="firstname"
          v-model="firstname"
          type="text"
          required
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label for="lastname" class="block text-gray-700 font-medium mb-1">Nom :</label>
        <input
          id="lastname"
          v-model="lastname"
          type="text"
          required
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label for="birthdate" class="block text-gray-700 font-medium mb-1">Date de naissance :</label>
        <input
          id="birthdate"
          type="date"
          v-model="birthdate"
          :min="minBirthdate"
          :max="maxBirthdate"
          required
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Enregistrer
      </button>

      <p v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export default defineComponent({
  setup() {
    const firstname = ref("");
    const lastname = ref("");
    const birthdate = ref("");
    const error = ref("");

    const router = useRouter();

   const today = new Date();
    const maxBirthdate = today.toISOString().split("T")[0]; 
    const minBirthdate = new Date(today.setFullYear(today.getFullYear() - 150))
      .toISOString()
      .split("T")[0]; 

    const savePerson = async () => {
      const selectedDate = new Date(birthdate.value);

      if (selectedDate > new Date()) {
        error.value = "La date de naissance ne peut pas être après aujourd'hui.";
        return;
      }

      if (selectedDate < new Date(minBirthdate)) {
        error.value = "La date de naissance doit être inférieure à 150 ans.";
        return;
      }


      try {
        await axios.post("http://localhost:3000/persons", {
          firstname: firstname.value,
          lastname: lastname.value,
          birthdate: birthdate.value,
        });
        toast.success("Personne ajoutée avec succès !", {
          onClose: () => {
            router.push(`/persons`);
          },
        });
        error.value = "";
      } catch (err) {
        error.value = "Erreur lors de l'ajout de la personne.";
      }
    };

    return { firstname, lastname, birthdate, maxBirthdate, minBirthdate, savePerson, error };
  },
});
</script>
