import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type z } from "zod";

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
      return e instanceof Error ? e : new Error(e);
    });
  return data;
}

function getRandomBytes(length: number): Uint8Array {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
}

// Usage:
const randomBytes = getRandomBytes(16);
export const state = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

// If you need it as a Buffer-like object:
const bufferLike = {
  toString: (encoding: string) => {
    if (encoding === "hex") {
      return state;
    }
    throw new Error("Unsupported encoding");
  },
};
