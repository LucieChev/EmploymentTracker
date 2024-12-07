import PersonList from '../components/PersonList.vue';
import PersonDetails from '../components/PersonDetails.vue';
import PersonForm from "../components/PersonForm.vue";
import JobForm from "../components/JobForm.vue";
import CompanySearch from '@/components/CompanySearch.vue';

export default [
  { path: "/", redirect: "/persons" },
  { path: "/persons", component: PersonList },
  { path: "/persons/add", component: PersonForm },
  { path: '/persons/:id', component: PersonDetails },
  { path: "/jobs/add", component: JobForm },
  { path: "/search/company", component: CompanySearch },
];
