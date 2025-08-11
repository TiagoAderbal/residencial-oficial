"use client";

import { Input } from "./input";
import { useState, useEffect, useRef } from "react";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MaskedInput = ({ mask, value, onChange, ...props }: MaskedInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const formatWithMask = (value: string, mask: string) => {
    let maskedValue = "";
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      if (mask[i] === "9") {
        if (/[0-9]/.test(value[valueIndex])) {
          maskedValue += value[valueIndex];
          valueIndex++;
        }
      } else {
        maskedValue += mask[i];
      }
    }

    return maskedValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const formattedValue = formatWithMask(rawValue, mask);

    // Atualiza o valor formatado no input
    if (inputRef.current) {
      inputRef.current.value = formattedValue;
    }

    // Chama o onChange com o valor sem formatação
    onChange({
      ...e,
      target: {
        ...e.target,
        value: rawValue,
      },
    });

    // Mantém a posição do cursor
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = getNewCursorPosition(
          inputRef.current.value,
          e.target.selectionStart || 0,
          mask
        );
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const getNewCursorPosition = (value: string, pos: number, mask: string) => {
    if (pos === 0) return pos;

    // Se estamos adicionando um caractere
    if (value.length > displayValue.length) {
      // Pula caracteres de máscara
      while (pos < mask.length && mask[pos] !== "9") {
        pos++;
      }
    }
    // Se estamos removendo um caractere
    else if (value.length < displayValue.length) {
      // Volta para o número anterior
      while (pos > 0 && mask[pos - 1] !== "9") {
        pos--;
      }
    }

    return pos;
  };

  // Valor inicial formatado
  const displayValue = formatWithMask(value, mask);

  return (
    <Input
      {...props}
      ref={inputRef}
      value={displayValue}
      onChange={handleChange}
    />
  );
};