"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  Pencil,
  Trash,
  Plus,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { EntidadSistema } from "../../types/entidad-sistema";
import { EntidadSistemaService } from "../../services/entidad-sistema.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { DisableDialog } from "@/src/components/entidad-sistema/disable-dialog";
import { DetailDialog } from "@/src/components/entidad-sistema/detail-dialog";
import { FormDialog } from "@/src/components/entidad-sistema/form-dialog";

const RUC_STORAGE_KEY = "current_ruc";
const LOGIN_URL = "http://localhost:8080/auth";

export default function EntidadSistemaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entidades, setEntidades] = useState<EntidadSistema[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntidad, setSelectedEntidad] = useState<EntidadSistema | null>(
    null
  );
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  ///
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [entidadDetalle, setEntidadDetalle] = useState<EntidadSistema | null>(
    null
  );

  // Capturar y validar RUC al cargar la página
  useEffect(() => {
    const rucFromUrl = searchParams?.get("ruc");

    if (rucFromUrl) {
      console.log("✅ RUC recibido desde URL:", rucFromUrl);
      localStorage.setItem(RUC_STORAGE_KEY, rucFromUrl);

      // Limpiar correctamente la URL sin recargar
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
      return;
    }

    const currentRuc = localStorage.getItem(RUC_STORAGE_KEY);

    if (!currentRuc) {
      console.warn("⚠️ No se encontró RUC. Redirigiendo al login...");
      window.location.href = LOGIN_URL;
      return;
    }

    console.log("✅ RUC encontrado en localStorage:", currentRuc);
  }, [searchParams]);

  const loadEntidades = async () => {
    try {
      setLoading(true);
      const data = await EntidadSistemaService.getAllWithElements();
      setEntidades(data);
      console.log("✅ Entidades cargadas:", data.length);
    } catch (error: any) {
      console.error("❌ Error cargando entidades:", error);
      alert(`Error: ${error.message || "No se pudieron cargar las entidades"}`);

      if (error.message?.includes("RUC") || error.message?.includes("válido")) {
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
    const currentRuc = localStorage.getItem(RUC_STORAGE_KEY);
    if (currentRuc) {
      loadEntidades();
    }
  }, []);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleView = async (entidad: EntidadSistema) => {
    try {
      setDetailOpen(true);
      const detalle = await EntidadSistemaService.getById(
        entidad.idEntidadSistema
      );
      setEntidadDetalle(detalle);
    } catch (error: any) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
      setDetailOpen(false);
    }
  };

  const handleEdit = (entidad: EntidadSistema) => {
    setSelectedEntidad(entidad);
    setFormOpen(true);
  };

  const handleDelete = (entidad: EntidadSistema) => {
    setSelectedEntidad(entidad);
    setDisableOpen(true);
  };

  const handleCreate = () => {
    setSelectedEntidad(null);
    setFormOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(RUC_STORAGE_KEY);
    window.location.href = LOGIN_URL;
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedEntidad) {
        await EntidadSistemaService.update(
          selectedEntidad.idEntidadSistema,
          data
        );
        alert("Entidad actualizada correctamente");
      } else {
        await EntidadSistemaService.create(data);
        alert("Entidad creada correctamente");
      }
      setFormOpen(false);
      loadEntidades();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDisable = async (usuarioModificacion: string) => {
    if (!selectedEntidad) return;
    try {
      setIsDisabling(true);
      await EntidadSistemaService.disable(
        selectedEntidad.idEntidadSistema,
        usuarioModificacion
      );
      alert("Entidad deshabilitada correctamente");
      setDisableOpen(false);
      loadEntidades();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsDisabling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando entidades...</p>
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
              <CardTitle>Entidades del Sistema</CardTitle>
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
              Nueva Entidad
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {entidades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay entidades disponibles
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Elementos</TableHead>
                  <TableHead>Sincronización</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entidades.map((entidad) => (
                  <>
                    <TableRow key={entidad.idEntidadSistema}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleRow(entidad.idEntidadSistema)}
                          className="h-6 w-6"
                        >
                          {expandedRows.has(entidad.idEntidadSistema) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {entidad.idEntidadSistema}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {entidad.nombreEntidadSistema}
                      </TableCell>
                      <TableCell>{entidad.idModuloSistema}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            entidad.indicadorEstado === "A"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {entidad.indicadorEstado === "A"
                            ? "Activo"
                            : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {entidad.elementos?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs">
                          <span>
                            Pendientes:{" "}
                            {entidad.numeroRegistrosPendientesSincronizacion}
                          </span>
                          <span className="text-muted-foreground">
                            Modo: {entidad.modoSincronizacion}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{entidad.usuarioRegistro}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(entidad)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(entidad)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(entidad)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Fila expandible con elementos */}
                    {expandedRows.has(entidad.idEntidadSistema) && (
                      <TableRow>
                        <TableCell colSpan={9} className="bg-muted/50">
                          <div className="p-4">
                            <h4 className="font-semibold mb-3">
                              Elementos ({entidad.elementos?.length || 0})
                            </h4>
                            {entidad.elementos &&
                            entidad.elementos.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {entidad.elementos.map((elemento) => (
                                  <div
                                    key={elemento.id}
                                    className="p-3 bg-background rounded-lg border"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-medium text-sm">
                                        {elemento.nombreElemento}
                                      </span>
                                      <Badge
                                        variant={
                                          elemento.indicadorEstado === "A"
                                            ? "default"
                                            : "secondary"
                                        }
                                        className="text-xs"
                                      >
                                        {elemento.indicadorEstado}
                                      </Badge>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                      <Badge
                                        variant={
                                          elemento.visible === "1"
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {elemento.visible === "1"
                                          ? "Visible"
                                          : "Oculto"}
                                      </Badge>
                                      <Badge
                                        variant={
                                          elemento.editable === "1"
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {elemento.editable === "1"
                                          ? "Editable"
                                          : "Solo lectura"}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No hay elementos para esta entidad
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <FormDialog
        entidad={selectedEntidad}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <DetailDialog
        entidad={entidadDetalle}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <DisableDialog
        entidad={selectedEntidad}
        open={disableOpen}
        onOpenChange={setDisableOpen}
        onConfirm={confirmDisable}
        isDisabling={isDisabling}
      />
    </div>
  );
}
