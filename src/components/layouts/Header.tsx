import { handleSignOut } from "@/lib/server/auth";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import Logo from "@/assets/logo.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, Home, LogOut, Menu, Moon, Sun, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Header = () => {
  const { setTheme } = useTheme();
  const { user, clearUser } = useAuthStore();

  const pathname = usePathname();

  const handleLogOut = () => {
    handleSignOut();
    clearUser();
    toast.success("Deslogado com sucesso!", { position: "top-center" });
  };

  console.log("Header user é: ", user);
  return (
    <header className="h-header px-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-50 dark:border-slate-900">
      <nav className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <div
          className="
                    hidden 
                    min-[480px]:block"
        >
          <Link href="/">
            <Image src={Logo} alt="Logo" width={170} priority />
          </Link>

          <Button
            className="flex min-[480px]:hidden"
            variant="outline"
            size="icon"
            asChild
          >
            <Link href="/">
              <Home className="size-[1.2rem]" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-6">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Alterar o tema</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user?.username && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-5">
                  <Avatar className="size-7">
                    <AvatarFallback>{user.first_name.slice(0, 1).toUpperCase() || ""}</AvatarFallback>
                  </Avatar>

                  <ChevronDown
                    className="size-5 text-slate-500 dark:text-slate-300"
                    strokeWidth={2.5}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/account">
                  <DropdownMenuItem>
                    <User className="mr-3 size-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-500"
                  onClick={handleLogOut}
                >
                  <LogOut className="mr-3 size-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
};
