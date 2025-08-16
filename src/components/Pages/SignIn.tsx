"use client";

import { SignInData, signInSchema } from "@/lib/schemas/authSchema";
import { handleGetUser, handleSignIn } from "@/lib/server/auth";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";

export const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInData) => {
    setLoading(true);
    const response = await handleSignIn(values);

    if (response.error) {
      setLoading(false);
      toast.error(response.error.message, { position: "top-center" });

      return;
    }


    const getUser = await handleGetUser();
    if (getUser) {
      setUser(getUser);
    }
    toast.success("Autenticado com sucesso!", { position: "top-center" });

    // Redirect to home
    router.push("/");
  };

  return (
    <main className="h-app flex items-center justify-center overflow-auto px-6">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Faça Login</CardTitle>
          <CardDescription>
            Insira seu email ou usuário para acessar sua conta.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-3">
                {loading ? (
                  <>
                    {...Array({ length: 2 }).map((_, key) => (
                      <Skeleton key={key} className="h-10 rounded-md" />
                    ))}
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuário</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu usuário"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Senha"
                                type={showPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showPassword ? "Esconder senha" : "Mostrar senha"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <Button disabled={loading}>Entrar</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};