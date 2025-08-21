"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Step4Props {
  form: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const Step4 = ({ form }: Step4Props) => {
  const { watch } = useFormContext();

  return (
    <>
      <div className="p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Mobilidade e Atividades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="grau_dependencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grau de Dependência</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "null" ? null : Number(value))
                    }
                    value={field.value === null ? "null" : field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Nenhuma dependência</SelectItem>
                      <SelectItem value="1">Leve dependência</SelectItem>
                      <SelectItem value="2">Moderada dependência</SelectItem>
                      <SelectItem value="3">Alta dependência</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cadeirante"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Cadeirante?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {watch("cadeirante") && (
                <FormField
                  control={form.control}
                  name="tempo_cadeirante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo como cadeirante</FormLabel>
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
                name="uso_aparelhos_locomocao"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Usa aparelhos de locomoção?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {watch("uso_aparelhos_locomocao") && (
                <FormField
                  control={form.control}
                  name="quais_aparelhos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quais aparelhos?</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name="preferencias"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-3">
                <FormLabel>Preferências e Interesses</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Hábitos e Condições</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="tabagista"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Tabagista</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="etilista"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Etilista</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="protese_dentaria"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Prótese Dentária</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="utiliza_fraldas"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Utiliza Fraldas</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orientacao_tempo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Orientação no Tempo</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orientacao_espaco"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Orientação no Espaço</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Atividades da Vida Diária</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="banho"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banho</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                      <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                      <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vestir"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vestir</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                      <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                      <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="banheiro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banheiro</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                      <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                      <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transferencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transferência</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                      <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                      <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="continencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Continência</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                      <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                      <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alimentacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alimentação</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sem_ajuda">Sem Ajuda</SelectItem>
                      <SelectItem value="ajuda_parcial">Ajuda Parcial</SelectItem>
                      <SelectItem value="ajuda_total">Ajuda Total</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Condições Clínicas e Funcionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="dificuldade_visual"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Dificuldade Visual</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usa_oculos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Usa Óculos</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="demencia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Demência</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {watch("demencia") && (
            <FormField
              control={form.control}
              name="tipo_demencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Demência</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="comunicacao_verbal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Comunicação Verbal</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dificuldade_fala"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Dificuldade de Fala</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dificuldade_auditiva"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Dificuldade Auditiva</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="protese_auditiva"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Prótese Auditiva</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avc"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>AVC</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tce"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>TCE</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hipertensao"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Hipertensão</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cardiopatias"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Cardiopatias</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {watch("cardiopatias") && (
            <FormField
              control={form.control}
              name="quais_cardiopatias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quais cardiopatias?</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="hipotireoidismo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Hipotireoidismo</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colesterol_alto"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Colesterol Alto</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="artrose"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Artrose</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="historico_cancer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Histórico de Câncer</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {watch("historico_cancer") && (
            <FormField
              control={form.control}
              name="tipo_cancer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Câncer</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="osteoporose"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Osteoporose</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fraturas"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Fraturas</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {watch("fraturas") && (
            <FormField
              control={form.control}
              name="onde_fraturas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Onde?</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="cirurgia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Cirurgia</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {watch("cirurgia") && (
            <FormField
              control={form.control}
              name="onde_cirurgia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Onde?</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="depressao"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Depressão</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="outros_antecedentes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outros Antecedentes</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Alimentação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="alimenta_sozinho"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Alimenta-se Sozinho</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipo_alimentacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Alimentação</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="pastosa">Pastosa</SelectItem>
                      <SelectItem value="líquida">Líquida</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dificuldade_degluticao"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Dificuldade de Deglutição</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="engasgos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Engasgos</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uso_sonda"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Uso de Sonda</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {watch("uso_sonda") && (
            <FormField
              control={form.control}
              name="tipo_sonda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Sonda</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="alergia_alimento"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Alergia Alimentar</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {watch("alergia_alimento") && (
            <FormField
              control={form.control}
              name="qual_alimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual alimento?</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>

      <div className="p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Mobilidade</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="caminha_sozinho"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Caminha Sozinho</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acamado"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Acamado</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {watch("acamado") && (
            <FormField
              control={form.control}
              name="tempo_acamado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo Acamado</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="risco_quedas"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Risco de Quedas</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Comportamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="comunicativa"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Comunicativa</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agressiva"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Agressiva</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="humor_instavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Humor Instável</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                      <SelectItem value="as_vezes">Às vezes</SelectItem>
                    </SelectContent>
                  </Select>
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
