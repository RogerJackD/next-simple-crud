import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CreateEntidadSistemaDto, EntidadSistema } from "../../types/entidad-sistema";

interface FormDialogProps {
  entidad?: EntidadSistema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function FormDialog({
  entidad,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: FormDialogProps) {
  const isEditMode = !!entidad;

  const [formData, setFormData] = useState({
    nombreEntidadSistema: "",
    idModuloSistema: "",
    modoSincronizacion: "2",
    numeroFilasPorPagina: "20",
    estadoImportacion: "0",
    nombrePlantillaImportacion: "",
    usuarioRegistro: "",
    usuarioModificacion: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (isEditMode && entidad) {
        // Modo edición
        setFormData({
          nombreEntidadSistema: entidad.nombreEntidadSistema,
          idModuloSistema: entidad.idModuloSistema.toString(),
          modoSincronizacion: entidad.modoSincronizacion,
          numeroFilasPorPagina: entidad.numeroFilasPorPagina.toString(),
          estadoImportacion: entidad.estadoImportacion,
          nombrePlantillaImportacion: entidad.nombrePlantillaImportacion,
          usuarioRegistro: entidad.usuarioRegistro,
          usuarioModificacion: "",
        });
      } else {
        // Modo creación
        setFormData({
          nombreEntidadSistema: "",
          idModuloSistema: "",
          modoSincronizacion: "2",
          numeroFilasPorPagina: "20",
          estadoImportacion: "0",
          nombrePlantillaImportacion: "",
          usuarioRegistro: "",
          usuarioModificacion: "",
        });
      }
      setErrors({});
    }
  }, [open, isEditMode, entidad]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreEntidadSistema.trim()) {
      newErrors.nombreEntidadSistema = "El nombre es requerido";
    }

    if (!formData.idModuloSistema) {
      newErrors.idModuloSistema = "El módulo del sistema es requerido";
    }

    if (isEditMode) {
      if (!formData.usuarioModificacion.trim()) {
        newErrors.usuarioModificacion = "El usuario de modificación es requerido";
      }
    } else {
      if (!formData.usuarioRegistro.trim()) {
        newErrors.usuarioRegistro = "El usuario de registro es requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (isEditMode) {
      // Modo edición
      const updateData = {
        nombreEntidadSistema: formData.nombreEntidadSistema,
        idModuloSistema: parseInt(formData.idModuloSistema),
        modoSincronizacion: formData.modoSincronizacion,
        numeroFilasPorPagina: parseInt(formData.numeroFilasPorPagina),
        estadoImportacion: formData.estadoImportacion,
        nombrePlantillaImportacion: formData.nombrePlantillaImportacion,
        usuarioModificacion: formData.usuarioModificacion,
      };
      onSubmit(updateData);
    } else {
      // Modo creación - SIN indicadorEstado
      const createData: CreateEntidadSistemaDto = {
        nombreEntidadSistema: formData.nombreEntidadSistema,
        idModuloSistema: parseInt(formData.idModuloSistema),
        usuarioRegistro: formData.usuarioRegistro,
        modoSincronizacion: formData.modoSincronizacion as '0' | '1' | '2' | '3',
        numeroFilasPorPagina: parseInt(formData.numeroFilasPorPagina),
        estadoImportacion: formData.estadoImportacion,
        nombrePlantillaImportacion: formData.nombrePlantillaImportacion || undefined,
      };
      onSubmit(createData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Entidad del Sistema" : "Nueva Entidad del Sistema"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Modifica los campos de la entidad"
              : "Completa los campos para crear una nueva entidad"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreEntidadSistema">Nombre de la Entidad *</Label>
              <Input
                id="nombreEntidadSistema"
                value={formData.nombreEntidadSistema}
                onChange={(e) => handleChange("nombreEntidadSistema", e.target.value)}
                disabled={isSubmitting}
                placeholder="NUEVA_ENTIDAD"
              />
              {errors.nombreEntidadSistema && (
                <p className="text-sm text-destructive">{errors.nombreEntidadSistema}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="idModuloSistema">ID Módulo Sistema *</Label>
              <Input
                id="idModuloSistema"
                type="number"
                value={formData.idModuloSistema}
                onChange={(e) => handleChange("idModuloSistema", e.target.value)}
                disabled={isSubmitting}
                placeholder="1"
              />
              {errors.idModuloSistema && (
                <p className="text-sm text-destructive">{errors.idModuloSistema}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modoSincronizacion">Modo Sincronización</Label>
              <Select
                value={formData.modoSincronizacion}
                onValueChange={(value) => handleChange("modoSincronizacion", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Manual</SelectItem>
                  <SelectItem value="1">1 - Automático</SelectItem>
                  <SelectItem value="2">2 - Híbrido</SelectItem>
                  <SelectItem value="3">3 - Deshabilitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroFilasPorPagina">Filas por Página</Label>
              <Input
                id="numeroFilasPorPagina"
                type="number"
                value={formData.numeroFilasPorPagina}
                onChange={(e) => handleChange("numeroFilasPorPagina", e.target.value)}
                disabled={isSubmitting}
                placeholder="20"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoImportacion">Estado Importación</Label>
              <Select
                value={formData.estadoImportacion}
                onValueChange={(value) => handleChange("estadoImportacion", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Deshabilitado</SelectItem>
                  <SelectItem value="1">1 - Habilitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="nombrePlantillaImportacion">Plantilla de Importación</Label>
              <Input
                id="nombrePlantillaImportacion"
                value={formData.nombrePlantillaImportacion}
                onChange={(e) => handleChange("nombrePlantillaImportacion", e.target.value)}
                disabled={isSubmitting}
                placeholder="assets/plantillas/ejemplo.xlsx"
              />
            </div>

            {isEditMode ? (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="usuarioModificacion">Usuario de Modificación *</Label>
                <Input
                  id="usuarioModificacion"
                  value={formData.usuarioModificacion}
                  onChange={(e) => handleChange("usuarioModificacion", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="admin"
                />
                {errors.usuarioModificacion && (
                  <p className="text-sm text-destructive">{errors.usuarioModificacion}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="usuarioRegistro">Usuario de Registro *</Label>
                <Input
                  id="usuarioRegistro"
                  value={formData.usuarioRegistro}
                  onChange={(e) => handleChange("usuarioRegistro", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="admin"
                />
                {errors.usuarioRegistro && (
                  <p className="text-sm text-destructive">{errors.usuarioRegistro}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditMode ? "Actualizando..." : "Creando...") 
                : (isEditMode ? "Actualizar" : "Crear Entidad")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}