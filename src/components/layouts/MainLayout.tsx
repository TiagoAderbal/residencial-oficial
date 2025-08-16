"use client";

import { useAuthStore } from "@/store/authStore";
import { User } from "@/types/User";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { BarLoader } from "react-spinners";
import { LeftSide } from "./Leftside";

type Props = {
  user: User | null;
  children: React.ReactNode;
};

export const MainLayout = ({ user, children }: Props) => {
  const auth = useAuthStore();
  console.log("auth é: ", auth);

  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    if (user) auth.setUser(user);

    setLoading(false);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-200 dark:bg-slate-950">
      <Header />

      {loading && (
        <div className="flex items-center justify-center h-full">
          <BarLoader color="#493cdd" />
        </div>
      )}

      {!loading && auth.user && !pathname.includes("auth") ? (
        <div className="flex h-full">
          <div className="hidden lg:block">
            <LeftSide />
          </div>

          <div className="flex-1">{children}</div>
        </div>
      ) : (
        <div className="flex-1">{children}</div>
      )}

    </div>
  );
};
