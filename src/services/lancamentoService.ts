import {
  getLancamentos,
  getDetailFornecedor,
  getDetailTipoConta,
  getDetailTipoDocumento,
  getDetailPlanoDeConta,
  getDetailFormaPagamento
} from "@/lib/requests";
import { toast } from "sonner";

type Fornecedor = { id: number; name: string };
type TipoConta = { id: number; name: string };
type TipoDocumento = { id: number; name: string };
type PlanoConta = { id: number; name: string };
type FormaPagamento = { id: number; name: string };

export type LancamentoCompleto = {
  id: number;
  user: number;
  supplier: number;
  supplierName: string;
  account: number;
  accountName: string;
  document: number;
  documentName: string;
  plan_account: number;
  planAccountName: string;
  payment_method: number;
  paymentMethodName: string;
  number: string;
  situation: string;
  situationName: string;
  installment: number;
  dueDate: string;
  value: string;
  formattedValue: string;
  fine: string;
  formattedFine: string;
  discount: string;
  formattedDiscount: string;
  amount_paid: string;
  formattedAmountPaid: string;
  observation: string;
  formattedDueDate: string;
  formattedInstallment: string;
};

const formatCurrency = (value: string): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value));
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
};

export const fetchLancamentosCompletos = async (): Promise<LancamentoCompleto[]> => {
  try {
    const { data: response } = await getLancamentos();
    const lancamentosBasicos = response?.results || [];

    const lancamentosCompletos = await Promise.all(
      lancamentosBasicos.map(async (lancamento) => {
        const [
          fornecedor,
          conta,
          documento,
          planoConta,
          formaPagamento
        ] = await Promise.all([
          getDetailFornecedor(lancamento.supplier),
          getDetailTipoConta(lancamento.account),
          getDetailTipoDocumento(lancamento.document),
          getDetailPlanoDeConta(lancamento.plan_account),
          getDetailFormaPagamento(lancamento.payment_method)
        ]);

        return {
          ...lancamento,
          supplierName: fornecedor?.data?.name || `Fornecedor #${lancamento.supplier}`,
          accountName: conta?.data?.name || `Conta #${lancamento.account}`,
          documentName: documento?.data?.name || `Documento #${lancamento.document}`,
          planAccountName: planoConta?.data?.name || `Plano #${lancamento.plan_account}`,
          paymentMethodName: formaPagamento?.data?.name || `Pagamento #${lancamento.payment_method}`,
          situationName: lancamento.situation === "0" ? "Pendente" : "Pago",
          formattedValue: formatCurrency(lancamento.value),
          formattedFine: formatCurrency(lancamento.fine),
          formattedDiscount: formatCurrency(lancamento.discount),
          formattedAmountPaid: formatCurrency(lancamento.amount_paid),
          formattedDueDate: formatDate(lancamento.dueDate),
          formattedInstallment: formatDate(lancamento.installment.toString())
        };
      })
    );

    return lancamentosCompletos;
  } catch (error) {
    toast.error("Erro ao carregar lançamentos");
    console.error("Erro no fetchLancamentosCompletos:", error);
    return [];
  }
};