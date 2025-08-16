import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: string) => {
  let onlyNumbers = value.replace(/\D/g, "");
  onlyNumbers = onlyNumbers.replace(/^0+/, "");
  if (onlyNumbers === "") return "0,00";
  onlyNumbers = onlyNumbers.padStart(3, "0");

  const integerPart = onlyNumbers.slice(0, -2);
  const decimalPart = onlyNumbers.slice(-2);

  const formattedInteger = integerPart
    .split("")
    .reverse()
    .join("")
    .replace(/(\d{3})(?=\d)/g, "$1.")
    .split("")
    .reverse()
    .join("")
    .replace(/^\./, "");

  return `${formattedInteger},${decimalPart}`;
};

export const parseCurrencyToFloat = (value: string) => {
  return parseFloat(value.replace(/\./g, "").replace(",", "."));
};
