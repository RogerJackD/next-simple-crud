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
import { ElementoEntidad, EntidadSistema } from "../../types/entidad-sistema";
import { CreateElementoEntidadDto } from "@/src/types/elemento-entidad";

interface FormDialogProps {
  elemento?: ElementoEntidad | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  entidades: EntidadSistema[];
}

export function FormDialog({
  elemento,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  entidades,
}: FormDialogProps) {
  const isEditMode = !!elemento;

  const [formData, setFormData] = useState({
    idEntidad: "",
    nombreElemento: "",
    visible: "1",
    editable: "1",
    usuarioRegistro: "",
    usuarioModificacion: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (isEditMode && elemento) {
        // Modo edición - cargar datos del elemento
        setFormData({
          idEntidad: elemento.idEntidad.toString(),
          nombreElemento: elemento.nombreElemento,
          visible: elemento.visible,
          editable: elemento.editable,
          usuarioRegistro: elemento.usuarioRegistro,
          usuarioModificacion: "",
        });
      } else {
        // Modo creación - resetear form
        setFormData({
          idEntidad: "",
          nombreElemento: "",
          visible: "1",
          editable: "1",
          usuarioRegistro: "",
          usuarioModificacion: "",
        });
      }
      setErrors({});
    }
  }, [open, isEditMode, elemento]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!isEditMode && !formData.idEntidad) {
      newErrors.idEntidad = "La entidad es requerida";
    }

    if (!formData.nombreElemento.trim()) {
      newErrors.nombreElemento = "El nombre del elemento es requerido";
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
      // Modo edición - solo enviar campos que se pueden actualizar
      const updateData = {
        nombreElemento: formData.nombreElemento,
        visible: formData.visible,
        editable: formData.editable,
        usuarioModificacion: formData.usuarioModificacion,
      };
      onSubmit(updateData);
    } else {
      // Modo creación - no enviar indicadorEstado (por defecto es 'A')
      const createData: CreateElementoEntidadDto = {
        idEntidad: formData.idEntidad,
        nombreElemento: formData.nombreElemento,
        visible: formData.visible,
        editable: formData.editable,
        usuarioRegistro: formData.usuarioRegistro,
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Elemento de Entidad" : "Nuevo Elemento de Entidad"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Modifica los campos del elemento"
              : "Completa los campos para crear un nuevo elemento"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="idEntidad">Entidad *</Label>
              <Select
                value={formData.idEntidad}
                onValueChange={(value) => handleChange("idEntidad", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una entidad" />
                </SelectTrigger>
                <SelectContent>
                  {entidades.map((entidad) => (
                    <SelectItem
                      key={entidad.idEntidadSistema}
                      value={entidad.idEntidadSistema.toString()}
                    >
                      {entidad.nombreEntidadSistema}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.idEntidad && (
                <p className="text-sm text-destructive">{errors.idEntidad}</p>
              )}
            </div>
          )}

          {isEditMode && (
            <div className="space-y-2">
              <Label>Entidad (no editable)</Label>
              <Input
                value={elemento?.entidad.nombreEntidadSistema || ""}
                disabled
                className="bg-muted"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombreElemento">Nombre del Elemento *</Label>
            <Input
              id="nombreElemento"
              value={formData.nombreElemento}
              onChange={(e) => handleChange("nombreElemento", e.target.value)}
              disabled={isSubmitting}
              placeholder="NuevoElemento"
            />
            {errors.nombreElemento && (
              <p className="text-sm text-destructive">{errors.nombreElemento}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="visible">Visible</Label>
            <Select
              value={formData.visible}
              onValueChange={(value) => handleChange("visible", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Sí</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editable">Editable</Label>
            <Select
              value={formData.editable}
              onValueChange={(value) => handleChange("editable", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Sí</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isEditMode ? (
            <div className="space-y-2">
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
            <div className="space-y-2">
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
                : (isEditMode ? "Actualizar" : "Crear Elemento")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}