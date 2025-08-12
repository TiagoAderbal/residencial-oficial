import { TipoLancamentoPage } from "@/components/Pages/TipoLancamentos";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipo de Lancamentos",
};

const TipoDeLancamentos = () => <TipoLancamentoPage />;

export default TipoDeLancamentos;
