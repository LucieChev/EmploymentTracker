import { JobAttributes } from "./Job";

export interface PersonAttributes {
    id: string;
    lastname: string;
    firstname: string;
    birthdate: Date;
    jobs: JobAttributes[];
  }
  