"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Settings, Layers, LogOut, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const RUC_STORAGE_KEY = 'current_ruc';
const LOGIN_URL = 'http://localhost:8080/auth';

interface MenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export function NavigationMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentRuc, setCurrentRuc] = useState<string | null>(null);

  // Cargar RUC solo en el cliente
  useEffect(() => {
    const ruc = localStorage.getItem(RUC_STORAGE_KEY);
    setCurrentRuc(ruc);
  }, []);

  const menuItems: MenuItem[] = [
    {
      title: "Parámetros del Sistema",
      description: "Gestiona los parámetros de configuración",
      icon: <Settings className="h-8 w-8" />,
      href: "/parametros-sistema",
    },
    {
      title: "Elementos de Entidad",
      description: "Administra elementos de entidades del sistema",
      icon: <Layers className="h-8 w-8" />,
      href: "/elemento-entidad",
    },
    {
      title: "Entidades del Sistema",
      description: "Administra entidades y sus elementos",
      icon: <Database className="h-8 w-8" />,
      href: "/entidad-sistema",
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem(RUC_STORAGE_KEY);
    window.location.href = LOGIN_URL;
  };

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              RUC: {currentRuc || 'Cargando...'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card
              key={item.href}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => handleNavigate(item.href)}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {item.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}