import { type ClassValue, clsx } from "clsx";
import type { Validator } from "react";
import { twMerge } from "tailwind-merge";
import { ZodError, type ZodRawShape, type z } from "zod";

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
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}. ${data}`);
      }

      return res;
    })
    .catch((e) => {
      return e instanceof Error ? e : new Error(e);
    });

  if (response instanceof Error) return response;

  const rawData = await response
    .json()
    .then((resData) => {
      const parsedData = responseValidator.parse(resData) as z.infer<T>;
      return parsedData;
    })
    .catch((e) => {
      return e instanceof Error ? e : new Error(e);
    });
  return rawData;
}
