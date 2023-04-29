import { Directus } from "@directus/sdk";

export const directus = new Directus(process.env.DIRECTUS_API_URL);
