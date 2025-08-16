import { AnotacoesPage } from "@/components/Pages/AnotacoesPacientes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anotações Pacientes",
};

const AnotacoesPacientes = () => <AnotacoesPage />;

export default AnotacoesPacientes;
