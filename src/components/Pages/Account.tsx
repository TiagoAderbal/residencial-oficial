"use client";

import { updateUser } from "@/lib/requests";
import { UpdateUserData, updateUserSchema } from "@/lib/schemas/userSchema";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

export const AccountPage = () => {
  const { user, setUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const form = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.username,
      email: user?.email,
      password: "",
      confirm_password: "",
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: UpdateUserData) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("avatar", avatar || "");

    const response = await updateUser(formData);

    if (response.error) {
      setLoading(false);
      toast.error(response.error.message, { position: "top-center" });
      return;
    }

    const user = response.data.user;
    setUser(user);

    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("password", values.password);
    formData.set("avatar", avatar || "");
    setAvatar(null);
    setLoading(false);

    toast.success("Perfil atualizado com sucesso!", { position: "top-center" });
  };

  return (
    <main className="h-app flex items-center justify-center overflow-auto px-6">
      <Card className="w-full sm:w-[450px]">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="pt-5 space-y-8"
            >
              <div className="space-y-6">
                {loading ? (
                  <>
                    {...Array({ length: 7 }).map((_, key) => (
                      <Skeleton key={key} className="h-10 rounded-md" />
                    ))}
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seu Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Jõao da Silva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seu Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: joao2000@gmail.com"
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
                          <FormLabel>Sua Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Ex: 123456"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirme sua senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Ex: 123456"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <Button className="w-full" disabled={loading}>
                Atualizar os dados
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};
