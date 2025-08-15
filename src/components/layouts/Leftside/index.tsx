import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Truck,
  Search,
  FileCheck,
  HeartHandshake,
  FolderTree,
  Home,
  BookOpenText,
  BadgeDollarSign,
  ClipboardList,
  Pill,
  Landmark,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  title: string;
  path: string;
  icon?: React.ReactNode;
};

type MenuCategory = {
  title: string;
  items: MenuItem[];
  icon?: React.ReactNode;
  path: string;
};

const normalize = (p: string) => {
  if (!p) return "";
  if (p === "/") return "/";
  return p.replace(/\/+$/, "");
};

export const LeftSide = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const menuData: MenuCategory[] = [
    {
      title: "Home",
      icon: <Home className="h-4 w-4" />,
      items: [],
      path: "/"
    },
    {
      title: "Financeiro",
      icon: <Landmark className="h-4 w-4" />,
      items: [
        { title: "Plano de Contas", path: "/plano-de-contas/", icon: <FolderTree className="h-4 w-4" /> },
        { title: "Fornecedores", path: "/fornecedores/", icon: <Truck className="h-4 w-4" /> },
        { title: "Tipos de Contas", path: "/tipo-de-contas/", icon: <BookOpenText className="h-4 w-4" /> },
        { title: "Tipos de Documentos", path: "/tipo-de-documentos/", icon: <FileCheck className="h-4 w-4" /> },
        { title: "Formas de Pagamento", path: "/forma-de-pagamentos/", icon: <BadgeDollarSign className="h-4 w-4" /> },
        { title: "Tipos de Lançamentos", path: "/tipo-de-lancamentos/", icon: <ClipboardList className="h-4 w-4" /> },
        { title: "Lançamentos", path: "/lancamentos/", icon: <FileCheck className="h-4 w-4" /> }
      ],
      path: ""
    },
    {
      title: "Operacional",
      icon: <HeartHandshake className="h-4 w-4" />,
      items: [
        { title: "Medicamentos", path: "/medicamentos/", icon: <Pill className="h-4 w-4" /> },
        { title: "Pacientes", path: "/pacientes/", icon: <Users className="h-4 w-4" /> },
        { title: "Prescrição Médica", path: "/prescricoes-medicas/" },
        { title: "Sinais Vitais", path: "/sinais-vitais/" },
        { title: "Anotações Pacientes", path: "/anotacoes-pacientes/" },
        { title: "Ocorrências", path: "/ocorrencias/" },
        { title: "Controle Medicações", path: "/controle-medicacoes/" }
      ],
      path: ""
    }
  ];

  // estado inicial: todas fechadas
  const initialExpanded = Object.fromEntries(menuData.map(c => [c.title, false])) as Record<string, boolean>;
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(initialExpanded);

  // Abre apenas a categoria do pathname atual (maior prefixo correspondente)
  useEffect(() => {
    const normPath = normalize(pathname || "/");

    let openTitle: string | null = null;
    let bestLen = -1;

    menuData.forEach(cat => {
      cat.items.forEach(item => {
        const itemNorm = normalize(item.path);
        // match exato ou prefixo com borda de "/"
        const matches =
          normPath === itemNorm || normPath.startsWith(itemNorm + "/");

        if (matches && itemNorm.length > bestLen) {
          bestLen = itemNorm.length;
          openTitle = cat.title;
        }
      });
    });

    const nextState: Record<string, boolean> = {};
    menuData.forEach(cat => {
      nextState[cat.title] = cat.title === openTitle;
    });

    setExpandedCategories(nextState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Alterna abrindo só a clicada
  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => {
      const willOpen = !prev[title];
      const nextState: Record<string, boolean> = {};
      menuData.forEach(cat => (nextState[cat.title] = false));
      nextState[title] = willOpen;
      return nextState;
    });
  };

  // Busca
  const filteredMenuData = menuData
    .map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(category => category.items.length > 0 || category.path !== "");

  return (
    <div className="bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 h-app overflow-auto">
      {/* Busca */}
      <div className="p-3 sticky top-0 bg-slate-100 dark:bg-slate-900 z-10">
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar no menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-1 p-2">
        {filteredMenuData.map((category) => (
          <div key={category.title} className="space-y-1">
            {category.items.length > 0 ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-between font-medium"
                  onClick={() => toggleCategory(category.title)}
                >
                  <div className="flex items-center">
                    {category.icon && <span className="mr-2">{category.icon}</span>}
                    <span>{category.title}</span>
                  </div>
                  {expandedCategories[category.title] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                {expandedCategories[category.title] && (
                  <div className="ml-4 space-y-1">
                    {category.items.map((item) => {
                      const active = normalize(pathname || "/") === normalize(item.path);
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${active
                            ? "bg-slate-200 dark:bg-slate-800 font-medium"
                            : "hover:bg-slate-200 hover:dark:bg-slate-800"
                            }`}
                        >
                          {item.icon && (
                            <span className={`mr-2 ${active ? "text-primary" : "text-muted-foreground"}`}>
                              {item.icon}
                            </span>
                          )}
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <Link href={category.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start font-medium ${normalize(pathname || "/") === normalize(category.path)
                    ? "bg-slate-200 dark:bg-slate-800"
                    : ""
                    }`}
                >
                  <div className="flex items-center">
                    {category.icon && <span className="mr-2">{category.icon}</span>}
                    <span>{category.title}</span>
                  </div>
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
