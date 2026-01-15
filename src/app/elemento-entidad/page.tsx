"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Pencil, Trash, Plus, ArrowLeft } from "lucide-react";
import { ElementoEntidad, EntidadSistema } from "../../types/entidad-sistema";
import { ElementoEntidadService } from "../../services/elemento-entidad.service";
import { EntidadSistemaService } from "../../services/entidad-sistema.service";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { FormDialog } from "../../components/elemento-entidad/form-dialog";
import { DetailDialog } from "@/src/components/elemento-entidad/detail-dialog";
import { DisableDialog } from "@/src/components/elemento-entidad/disable-dialog";

const RUC_STORAGE_KEY = 'current_ruc';
const LOGIN_URL = 'http://localhost:8080/auth';

export default function ElementoEntidadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [elementos, setElementos] = useState<ElementoEntidad[]>([]);
  const [entidades, setEntidades] = useState<EntidadSistema[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedElemento, setSelectedElemento] = useState<ElementoEntidad | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [disableOpen, setDisableOpen] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);


  const [detailOpen, setDetailOpen] = useState(false);
  const [elementoDetalle, setElementoDetalle] = useState<ElementoEntidad | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);


  // Capturar y validar RUC al cargar la página
  useEffect(() => {
    const rucFromUrl = searchParams?.get('ruc');
    
    if (rucFromUrl) {
      console.log('✅ RUC recibido desde URL:', rucFromUrl);
      localStorage.setItem(RUC_STORAGE_KEY, rucFromUrl);
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      return;
    }
    
    const currentRuc = localStorage.getItem(RUC_STORAGE_KEY);
    
    if (!currentRuc) {
      console.warn('⚠️ No se encontró RUC. Redirigiendo al login...');
      window.location.href = LOGIN_URL;
      return;
    }
    
    console.log('✅ RUC encontrado en localStorage:', currentRuc);
  }, [searchParams]);

  const loadElementos = async () => {
    try {
      setLoading(true);
      const data = await ElementoEntidadService.getAllWithRelations();
      setElementos(data);
      console.log('✅ Elementos cargados:', data.length);
    } catch (error: any) {
      console.error('❌ Error cargando elementos:', error);
      alert(`Error: ${error.message || 'No se pudieron cargar los elementos'}`);
      
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

  const loadEntidades = async () => {
    try {
      const data = await EntidadSistemaService.getAllWithElements();
      setEntidades(data);
      console.log('✅ Entidades cargadas para select:', data.length);
    } catch (error: any) {
      console.error('❌ Error cargando entidades:', error);
    }
  };

  useEffect(() => {
    const currentRuc = localStorage.getItem(RUC_STORAGE_KEY);
    if (currentRuc) {
      loadElementos();
      loadEntidades();
    }
  }, []);

  const handleView = async (elemento: ElementoEntidad) => {
  try {
    setLoadingDetalle(true);
    setDetailOpen(true);
    const detalleCompleto = await ElementoEntidadService.getById(elemento.id);
    setElementoDetalle(detalleCompleto);
  } catch (error: any) {
    console.error('Error cargando detalle:', error);
    alert(`Error: ${error.message || 'No se pudo cargar el detalle'}`);
    setDetailOpen(false);
  } finally {
    setLoadingDetalle(false);
  }
};

  const handleEdit = (elemento: ElementoEntidad) => {
  setSelectedElemento(elemento);
  setFormOpen(true);
};

  const handleDelete = (elemento: ElementoEntidad) => {
  setSelectedElemento(elemento);
  setDisableOpen(true);
  };


  const handleCreate = () => {
    console.log('🔵 Abriendo formulario de creación');
    setSelectedElemento(null);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
  try {
    setIsSubmitting(true);
    
    if (selectedElemento) {
      // Modo edición
      await ElementoEntidadService.update(selectedElemento.id, data);
      alert("Elemento actualizado correctamente");
    } else {
      // Modo creación
      await ElementoEntidadService.create(data);
      alert("Elemento creado correctamente");
    }
    
    setFormOpen(false);
    loadElementos();
  } catch (error: any) {
    alert(`Error: ${error.message || 'No se pudo guardar el elemento'}`);
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};

const confirmDisable = async (usuarioModificacion: string) => {
  if (!selectedElemento) return;

  try {
    setIsDisabling(true);
    await ElementoEntidadService.disable(selectedElemento.id, usuarioModificacion);
    alert("Elemento deshabilitado correctamente");
    setDisableOpen(false);
    loadElementos();
  } catch (error: any) {
    alert(`Error: ${error.message || 'No se pudo deshabilitar el elemento'}`);
    console.error(error);
  } finally {
    setIsDisabling(false);
  }
};



  const handleLogout = () => {
    localStorage.removeItem(RUC_STORAGE_KEY);
    window.location.href = LOGIN_URL;
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando elementos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Elementos de Entidad</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                RUC: {localStorage.getItem(RUC_STORAGE_KEY)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Elemento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {elementos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay elementos disponibles
            </div>
          ) : (
            <Table>
              {/* ... resto de la tabla igual ... */}
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre Elemento</TableHead>
                  <TableHead>Entidad</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Editable</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Usuario Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elementos.map((elemento) => (
                  <TableRow key={elemento.id}>
                    <TableCell className="font-medium">{elemento.id}</TableCell>
                    <TableCell>{elemento.nombreElemento}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{elemento.entidad.nombreEntidadSistema}</span>
                        <span className="text-xs text-muted-foreground">ID: {elemento.entidad.idEntidadSistema}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={elemento.visible === "1" ? "default" : "secondary"}>
                        {elemento.visible === "1" ? "Sí" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={elemento.editable === "1" ? "default" : "secondary"}>
                        {elemento.editable === "1" ? "Sí" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={elemento.indicadorEstado === "A" ? "default" : "secondary"}>
                        {elemento.indicadorEstado === "A" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{elemento.usuarioRegistro}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(elemento)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(elemento)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(elemento)}>
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

      <FormDialog
  elemento={selectedElemento}
  open={formOpen}
  onOpenChange={setFormOpen}
  onSubmit={handleSubmit}
  isSubmitting={isSubmitting}
  entidades={entidades}
/>

<DisableDialog
  elemento={selectedElemento}
  open={disableOpen}
  onOpenChange={setDisableOpen}
  onConfirm={confirmDisable}
  isDisabling={isDisabling}
/>

      <DetailDialog
        elemento={elementoDetalle}
        open={detailOpen}
        onOpenChange={setDetailOpen}
       />
    </div>
  );
}