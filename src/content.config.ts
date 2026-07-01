import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const changelog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/changelog" }),
  schema: z.object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    releaseDate: z.coerce.date(),
    tag: z.string().regex(/^roder\/v\d+\.\d+\.\d+$/),
    githubUrl: z.string().url(),
    headline: z.string().min(1),
    summary: z.string().min(1),
    demo: z
      .object({
        command: z.string().min(1),
        caption: z.string().min(1),
        image: z.string().startsWith("/"),
        alt: z.string().min(1),
      })
      .optional(),
  }),
});

export const collections = { changelog };
