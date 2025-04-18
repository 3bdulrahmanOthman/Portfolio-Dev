import { z } from "zod";

import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import { getSortingStateParser } from "@/lib/parsers";
import { ProjectSchema, ContactSchema, AboutSchema } from '@/schemas';
import { getFiltersStateParser } from '../parsers';

export type Project = z.infer<typeof ProjectSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type About = z.infer<typeof AboutSchema>;

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Project>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  title: parseAsString.withDefault(""),
  featured: parseAsArrayOf(z.enum(["featured", "standard"])).withDefault([]),
  createdAt: parseAsArrayOf(z.coerce.number()).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
});

export type GetProjectSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;