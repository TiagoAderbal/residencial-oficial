"use client";

import Image from "next/image";
import HomeData from "@/assets/home-data.svg";
import { Button } from "../ui/button";
import { Lock } from "lucide-react";

export const HomePage = () => {

  return (
    <div className="h-app">
      <div className="flex flex-col items-center gap-12 py-8 h-full px-4">
        <div className="flex flex-col items-center justify-center gap-12 flex-1">
          <Image
            src={HomeData}
            alt="Home Section"
            width={440}
            priority
          />

          <p className="text-xl max-w-xl text-center font-bold text-slate-600 dark:text-slate-300">
            Por favor, escolha um dos itens no menu ao lado.
          </p>

        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <Lock className="size-4" strokeWidth={3} />
          Suas mensagens pessoais são protegidas com a criptografia de ponta a
          ponta.
        </div>
      </div>
    </div>
  );
};
