"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pacienteSchema, PacienteFormValues } from "@/lib/schemas/pacienteSchema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { createPaciente, updatePaciente } from "@/lib/requests";
import { toast } from "sonner";
import { Paciente } from "@/types/Pacientes";
import { useAuthStore } from "@/store/authStore";

interface PacientesFormProps {
  onSuccess: () => void;
  defaultValues?: Partial<Paciente>;
  loading?: boolean;
  onCancel: () => void;
}

const formatPacienteForForm = (
  paciente: Partial<Paciente> | null | undefined
): Partial<PacienteFormValues> | undefined => {
  if (!paciente) return undefined;

  const formValues: Partial<PacienteFormValues> = {};
  for (const key in paciente) {
    const typedKey = key as keyof Paciente;
    const value = paciente[typedKey];
    if (value !== null && value !== undefined) {
      (formValues as any)[typedKey] = value;
    } else {
      (formValues as any)[typedKey] = "";
    }
  }
  return formValues;
};

export const PacientesForm = ({ defaultValues, loading, onCancel, onSuccess }: PacientesFormProps) => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [patientId, setPatientId] = useState<number | null>(defaultValues?.id || null);

  const form = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      ...formatPacienteForForm(defaultValues),
      id_user: user?.id // Adicione o id_user nos valores padrão
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(formatPacienteForForm(defaultValues));
      setPatientId(defaultValues.id || null);
    }
  }, [defaultValues, form]);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleCreatePatient = async (data: PacienteFormValues) => {
    if (!user) {
      toast.error("Usuário não autenticado.");
      return;
    }

    try {
      const response = await createPaciente({ ...data, idade: Number(data.idade || 0), user });
      if (response && response.data) {
        toast.success("Paciente criado com sucesso!");
        setPatientId(response.data.id);
        handleNext();
      } else {
        throw new Error("Falha ao criar paciente");
      }
    } catch (error) {
      toast.error("Erro ao criar paciente.");
    }
  };

  const handleUpdatePatient = async (data: PacienteFormValues) => {
    if (!patientId || !user) return;

    try {
      await updatePaciente(patientId, { ...data, idade: Number(data.idade || 0), user });
      toast.success("Paciente atualizado com sucesso!");
      if (currentStep < 4) {
        handleNext();
      } else {
        onSuccess();
      }
    } catch (error) {
      toast.error("Erro ao atualizar paciente.");
    }
  };

  const onSubmit = (data: PacienteFormValues) => {
    if (currentStep === 1 && !patientId) {
      handleCreatePatient(data);
    } else {
      handleUpdatePatient(data);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {currentStep === 1 && <Step1 form={form} userId={user?.id} />}
        {currentStep === 2 && <Step2 form={form} />}
        {currentStep === 3 && <Step3 form={form} />}
        {currentStep === 4 && <Step4 form={form} />}

        <div className="flex justify-end gap-4 pt-6">
          <pre>
            <code>
              {JSON.stringify(form.getValues(), null, 2)}
            </code>
          </pre>
          {currentStep > 1 && (
            <Button variant="outline" type="button" onClick={handlePrev}>
              Anterior
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : currentStep === 4 ? "Salvar" : "Próximo"}
          </Button>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
};
