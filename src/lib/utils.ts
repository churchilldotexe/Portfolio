import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError, type z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetcher<T extends z.ZodTypeAny>(
  url: string | Request | URL,
  init: RequestInit,
  responseValidator: T
) {
  const response = await fetch(url, init)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}.`);
      }

      return res;
    })
    .catch((e) => {
      return e instanceof Error ? e : new Error(e);
    });

  if (response instanceof Error) return response;

  const data = await response
    .json()
    .then((resData) => {
      const parsedData = responseValidator.parse(resData) as z.infer<T>;
      return parsedData;
    })
    .catch((e) => {
      return e instanceof Error ? e : e instanceof ZodError ? e : new Error(e);
    });
  return data;
}

export function removeArrayItem<T>(value: T, arr: T[]): T[] {
  if (arr.length === 0) return [...arr];

  const set = new Set(arr);
  if (!set.has(value)) return [...arr];
  set.delete(value);

  return Array.from(set);
}
