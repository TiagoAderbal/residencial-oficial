import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { ChevronDown, ChevronRight, Truck, Search, LayoutDashboard, ScanHeart, FolderTree, Home } from "lucide-react";
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

export const LeftSide = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Financeiro: true,
    Operacional: true
  });

  // Dados do menu com ícones apenas para categorias e fornecedores
  const menuData: MenuCategory[] = [
    {
      title: "Home",
      icon: <Home className="h-4 w-4" />,
      items: [],
      path: "/"
    },
    {
      title: "Financeiro",
      icon: <LayoutDashboard className="h-4 w-4" />,
      items: [
        { title: "Plano de Contas", path: "/plano-de-contas/", icon: <FolderTree className="h-4 w-4" /> },
        { title: "Fornecedores", path: "/fornecedores/", icon: <Truck className="h-4 w-4" /> },
        { title: "Tipos de Contas", path: "/tipo-de-contas" },
        { title: "Tipos de Documentos", path: "/tipo-de-documentos/" },
        { title: "Formas de Pagamento", path: "/forma-de-pagamentos/" },
        { title: "Tipos de Lançamentos", path: "tipo-de-lancamentos/" },
        { title: "Lançamentos", path: "/lancamentos/" }
      ],
      path: ""
    },
    {
      title: "Operacional",
      icon: <ScanHeart className="h-4 w-4" />,
      items: [
        { title: "Medicamentos", path: "/medicamentos/" },
        { title: "Pacientes", path: "/pacientes/" },
        { title: "Prescrição Médica", path: "/prescricoes-medicas/" },
        { title: "Sinais Vitais", path: "/sinais-vitais/" },
        { title: "Anotações Pacientes", path: "/anotacoes-pacientes/" },
        { title: "Ocorrências", path: "/ocorrencias/" },
        { title: "Controle Medicações", path: "/controle-medicacoes/" }
      ],
      path: ""
    }
  ];

  // Filtra os itens do menu baseado na busca
  const filteredMenuData = menuData.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0 || category.path !== "");

  // Alterna a expansão das categorias
  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 h-app overflow-auto">
      {/* Barra de busca */}
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
                    {category.icon && (
                      <span className="mr-2">
                        {category.icon}
                      </span>
                    )}
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
                    {category.items.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${pathname === item.path
                          ? "bg-slate-200 dark:bg-slate-800 font-medium"
                          : "hover:bg-slate-200 hover:dark:bg-slate-800"
                          }`}
                      >
                        {item.icon && (
                          <span className={`mr-2 ${pathname === item.path
                            ? "text-primary"
                            : "text-muted-foreground"
                            }`}>
                            {item.icon}
                          </span>
                        )}
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link href={category.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start font-medium ${pathname === category.path
                    ? "bg-slate-200 dark:bg-slate-800"
                    : ""}`}
                >
                  <div className="flex items-center">
                    {category.icon && (
                      <span className="mr-2">
                        {category.icon}
                      </span>
                    )}
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