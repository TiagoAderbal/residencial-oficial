import { PacientesPage } from "@/components/Pages/Pacientes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pacientes",
};

const Pacientes = () => <PacientesPage />;

export default Pacientes;
