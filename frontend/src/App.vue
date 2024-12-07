<script setup lang="ts">
</script>

<template>
  <div class="p-4">
    <!-- Barre de navigation -->
    <nav class="bg-blue-800 text-white rounded-md shadow-lg">
      <ul class="flex flex-col sm:flex-row items-center sm:justify-center p-0">
        <li class="h-12 flex-1 sm:border-r border-blue-700 sm:last:border-r-0 w-full sm:w-auto">
          <router-link
            to="/persons"
            class="hover:bg-blue-700 h-full flex items-center justify-center px-4 py-2 transition-colors text-center"
            active-class="bg-blue-700"
          >
            Liste complète
          </router-link>
        </li>
        <li class="h-12 flex-1 sm:border-r border-blue-700 sm:last:border-r-0 w-full sm:w-auto">
          <router-link
            to="/persons/add"
            class="hover:bg-blue-700 h-full flex items-center justify-center px-4 py-2 transition-colors text-center"
            active-class="bg-blue-700"
          >
            Ajout d'une personne
          </router-link>
        </li>
        <li class="h-12 flex-1 w-full sm:w-auto">
          <router-link
            to="/search/company"
            class="hover:bg-blue-700 h-full flex items-center justify-center px-4 py-2 transition-colors text-center"
            active-class="bg-blue-700"
          >
            Recherche par entreprise
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Contenu dynamique -->
    <div class="mt-6">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
</style>
