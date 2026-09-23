import { z } from "zod";

export const CategorySchema = z.enum([
  "tents", "sup", "backpacks", "sleeping", "stoves",
]);

export type Category = z.infer<typeof CategorySchema>;

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "tents", label: "Палатки" },
  { value: "sup", label: "Сапборды" },
  { value: "backpacks", label: "Рюкзаки" },
  { value: "sleeping", label: "Спальники" },
  { value: "stoves", label: "Горелки" },
];

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}