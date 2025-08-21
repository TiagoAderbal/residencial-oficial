"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Step3Props {
  form: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const Step3 = ({ form }: Step3Props) => {
  const { watch } = useFormContext();

  return (
    <>
      <div className="p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Informações de Saúde</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="tipo_sanguineo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo Sanguíneo</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="possui_convenio"
              render={({ field }) => (
                <FormItem className="flex flex-row items-end space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Possui convênio médico?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {watch("possui_convenio") && (
              <FormField
                control={form.control}
                name="nome_convenio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Convênio</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="medicamentos_uso"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-3">
                <FormLabel>Medicamentos em Uso</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="alergias_medicamentosas"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Alergias medicamentosas?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {watch("alergias_medicamentosas") && (
                <FormField
                  control={form.control}
                  name="quais_alergias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quais alergias?</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="diabetes"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Diabetes?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {watch("diabetes") && (
                <FormField
                  control={form.control}
                  name="tipo_diabetes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Diabetes</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tipo 1">Tipo 1</SelectItem>
                            <SelectItem value="Tipo 2">Tipo 2</SelectItem>
                            <SelectItem value="Gestacional">Gestacional</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Vacinação e Saúde</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="receituario_medico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receituário Médico</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carteira_vacinacao"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Carteira de Vacinação</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="situacao_vacinal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação Vacinal</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_dia">Em Dia</SelectItem>
                      <SelectItem value="programada">Programada</SelectItem>
                      <SelectItem value="em_atraso">Em Atraso</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vacina_covid_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>1ª Dose COVID</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e.target.value === "" ? null : e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vacina_covid_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>2ª Dose COVID</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e.target.value === "" ? null : e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vacina_covid_3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>3ª Dose COVID</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e.target.value === "" ? null : e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vacina_covid_4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>4ª Dose COVID</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e.target.value === "" ? null : e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
};
