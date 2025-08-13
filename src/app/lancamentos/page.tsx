import { LancamentosPage } from "@/components/Pages/Lancamentos";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lançamentos",
};

const Lancamentos = () => <LancamentosPage />;

export default Lancamentos;
