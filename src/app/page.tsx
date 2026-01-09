"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Pencil, Trash, Plus } from "lucide-react";
import { ParametroSistema } from "../types/parametro-sistema";
import { ParametroSistemaService } from "../services/parametro-sistema.service";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { DetailDialog } from "../components/parametros/detail-dialog";
import { FormDialog } from "../components/parametros/form-dialog";
import { DisableDialog } from "../components/parametros/edit-dialog";

const RUC_STORAGE_KEY = 'current_ruc';
const LOGIN_URL = 'http://localhost:8080/auth';

export default function ParametrosSistemaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [parametros, setParametros] = useState<ParametroSistema[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParametro, setSelectedParametro] = useState<ParametroSistema | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Capturar y validar RUC al cargar la página
  useEffect(() => {
    const rucFromUrl = searchParams?.get('ruc');
    
    if (rucFromUrl) {
      console.log('✅ RUC recibido desde URL:', rucFromUrl);
      localStorage.setItem(RUC_STORAGE_KEY, rucFromUrl);
      
      // Limpiar el query param de la URL
      router.replace(window.location.pathname);
    } else {
      // Verificar si hay RUC en localStorage
      const currentRuc = localStorage.getItem(RUC_STORAGE_KEY);
      
      if (!currentRuc) {
        console.warn('⚠️ No se encontró RUC. Redirigiendo al login...');
        window.location.href = LOGIN_URL;
        return;
      }
      
      console.log('✅ RUC encontrado en localStorage:', currentRuc);
    }
  }, [searchParams, router]);

  const loadParametros = async () => {
    try {
      setLoading(true);
      const data = await ParametroSistemaService.getAll();
      setParametros(data);
      console.log('✅ Parámetros cargados:', data.length);
    } catch (error: any) {
      console.error('❌ Error cargando parámetros:', error);
      alert(`Error: ${error.message || 'No se pudieron cargar los parámetros'}`);
      
      // Si el error es por RUC inválido, redirigir al login
      if (error.message?.includes('RUC') || error.message?.includes('válido')) {
        localStorage.removeItem(RUC_STORAGE_KEY);
        setTimeout(() => {
          window.location.href = LOGIN_URL;
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Solo cargar parámetros si hay RUC
    const currentRuc = localStorage.getItem(RUC_STORAGE_KEY);
    if (currentRuc) {
      loadParametros();
    }
  }, []);

  const handleView = (parametro: ParametroSistema) => {
    setSelectedParametro(parametro);
    setDetailOpen(true);
  };

  const handleEdit = (parametro: ParametroSistema) => {
    setSelectedParametro(parametro);
    setFormOpen(true);
  };

  const handleDelete = (parametro: ParametroSistema) => {
    setSelectedParametro(parametro);
    setDisableOpen(true);
  };

  const handleCreate = () => {
    setSelectedParametro(null);
    setFormOpen(true);
  };

  const confirmDisable = async (usuarioModificacion: string) => {
    if (!selectedParametro) return;

    try {
      setIsDisabling(true);
      await ParametroSistemaService.disable(
        selectedParametro.idParametroSistema,
        usuarioModificacion
      );
      alert("Parámetro deshabilitado correctamente");
      setDisableOpen(false);
      loadParametros();
    } catch (error: any) {
      alert(`Error: ${error.message || 'No se pudo deshabilitar el parámetro'}`);
      console.error(error);
    } finally {
      setIsDisabling(false);
    }
  };

  const handleSubmit = async (data: Partial<ParametroSistema>) => {
    try {
      setIsSubmitting(true);
      if (selectedParametro) {
        await ParametroSistemaService.update(selectedParametro.idParametroSistema, data);
        alert("Parámetro actualizado correctamente");
      } else {
        await ParametroSistemaService.create(data as any);
        alert("Parámetro creado correctamente");
      }
      setFormOpen(false);
      loadParametros();
    } catch (error: any) {
      alert(
        selectedParametro
          ? `Error: ${error.message || 'No se pudo actualizar el parámetro'}`
          : `Error: ${error.message || 'No se pudo crear el parámetro'}`
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(RUC_STORAGE_KEY);
    window.location.href = LOGIN_URL;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando parámetros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Parámetros del Sistema</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              RUC: {localStorage.getItem(RUC_STORAGE_KEY)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Parámetro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {parametros.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay parámetros disponibles
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Usuario Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parametros.map((param) => (
                  <TableRow key={param.idParametroSistema}>
                    <TableCell className="font-medium">
                      {param.idParametroSistema}
                    </TableCell>
                    <TableCell>{param.nombreParametroSistema}</TableCell>
                    <TableCell>{param.valorParametroSistema}</TableCell>
                    <TableCell>
                      <Badge
                        variant={param.indicadorEstado === "A" ? "default" : "secondary"}
                      >
                        {param.indicadorEstado === "A" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{param.usuarioRegistro}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(param)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(param)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(param)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DetailDialog
        parametro={selectedParametro}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <DisableDialog
        parametro={selectedParametro}
        open={disableOpen}
        onOpenChange={setDisableOpen}
        onConfirm={confirmDisable}
        isDisabling={isDisabling}
      />

      <FormDialog
        parametro={selectedParametro}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}