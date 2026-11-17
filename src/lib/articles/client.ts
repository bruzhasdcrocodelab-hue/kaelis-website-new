import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

if (!projectId || !dataset) {
  throw new Error("Sanity project configuration is missing");
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-11-17",
  useCdn: true,
  perspective: "published",
});

