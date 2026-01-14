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
import { ParametroSistema } from "../../types/parametro-sistema";

interface FormDialogProps {
  parametro: ParametroSistema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<ParametroSistema>) => void;
  isSubmitting: boolean;
}

export function FormDialog({
  parametro,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: FormDialogProps) {
  const [formData, setFormData] = useState({
    nombreParametroSistema: "",
    valorParametroSistema: "",
    idGrupoParametro: "",
    idEntidadSistema: "",
    usuarioRegistro: "",
    usuarioModificacion: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (parametro) {
      // Modo edición
      setFormData({
        nombreParametroSistema: parametro.nombreParametroSistema,
        valorParametroSistema: parametro.valorParametroSistema,
        idGrupoParametro: parametro.idGrupoParametro?.toString() || "",
        idEntidadSistema: parametro.idEntidadSistema.toString(),
        usuarioRegistro: parametro.usuarioRegistro,
        usuarioModificacion: "", // Usuario que realiza la modificación
      });
    } else {
      // Modo creación
      setFormData({
        nombreParametroSistema: "",
        valorParametroSistema: "",
        idGrupoParametro: "",
        idEntidadSistema: "",
        usuarioRegistro: "",
        usuarioModificacion: "",
      });
    }
    setErrors({});
  }, [parametro, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreParametroSistema.trim()) {
      newErrors.nombreParametroSistema = "El nombre es requerido";
    }

    if (!formData.valorParametroSistema.trim()) {
      newErrors.valorParametroSistema = "El valor es requerido";
    }

    if (!formData.idEntidadSistema) {
      newErrors.idEntidadSistema = "La entidad del sistema es requerida";
    }

    if (parametro) {
      // En modo edición, validar usuarioModificacion
      if (!formData.usuarioModificacion.trim()) {
        newErrors.usuarioModificacion = "El usuario de modificación es requerido";
      }
    } else {
      // En modo creación, validar usuarioRegistro
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

    const submitData: Partial<ParametroSistema> = {
      nombreParametroSistema: formData.nombreParametroSistema,
      valorParametroSistema: formData.valorParametroSistema,
      ...(formData.idGrupoParametro && {
        idGrupoParametro: parseInt(formData.idGrupoParametro),
      }),
    };

    if (parametro) {
      // Modo edición - NO enviar idEntidadSistema
      submitData.usuarioModificacion = formData.usuarioModificacion;
    } else {
      // Modo creación - SÍ enviar idEntidadSistema
      submitData.idEntidadSistema = parseInt(formData.idEntidadSistema);
      submitData.usuarioRegistro = formData.usuarioRegistro;
    }

    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
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
            {parametro ? "Editar Parámetro" : "Nuevo Parámetro"}
          </DialogTitle>
          <DialogDescription>
            {parametro
              ? "Modifica los campos del parámetro del sistema"
              : "Completa los campos para crear un nuevo parámetro"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombreParametroSistema">
              Nombre del Parámetro *
            </Label>
            <Input
              id="nombreParametroSistema"
              value={formData.nombreParametroSistema}
              onChange={(e) =>
                handleChange("nombreParametroSistema", e.target.value)
              }
              disabled={isSubmitting}
              placeholder="TIMEOUT_SESSION"
            />
            {errors.nombreParametroSistema && (
              <p className="text-sm text-destructive">
                {errors.nombreParametroSistema}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorParametroSistema">Valor *</Label>
            <Input
              id="valorParametroSistema"
              value={formData.valorParametroSistema}
              onChange={(e) =>
                handleChange("valorParametroSistema", e.target.value)
              }
              disabled={isSubmitting}
              placeholder="3600"
            />
            {errors.valorParametroSistema && (
              <p className="text-sm text-destructive">
                {errors.valorParametroSistema}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idEntidadSistema">ID Entidad Sistema *</Label>
            <Input
              id="idEntidadSistema"
              type="number"
              value={formData.idEntidadSistema}
              onChange={(e) => handleChange("idEntidadSistema", e.target.value)}
              disabled={isSubmitting}
              placeholder="1"
            />
            {errors.idEntidadSistema && (
              <p className="text-sm text-destructive">
                {errors.idEntidadSistema}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idGrupoParametro">
              ID Grupo Parámetro (opcional)
            </Label>
            <Input
              id="idGrupoParametro"
              type="number"
              value={formData.idGrupoParametro}
              onChange={(e) => handleChange("idGrupoParametro", e.target.value)}
              disabled={isSubmitting}
              placeholder="1"
            />
          </div>

          {parametro ? (
            <div className="space-y-2">
              <Label htmlFor="usuarioModificacion">
                Usuario de Modificación *
              </Label>
              <Input
                id="usuarioModificacion"
                value={formData.usuarioModificacion}
                onChange={(e) =>
                  handleChange("usuarioModificacion", e.target.value)
                }
                disabled={isSubmitting}
                placeholder="Tu usuario"
              />
              {errors.usuarioModificacion && (
                <p className="text-sm text-destructive">
                  {errors.usuarioModificacion}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="usuarioRegistro">Usuario de Registro *</Label>
              <Input
                id="usuarioRegistro"
                value={formData.usuarioRegistro}
                onChange={(e) =>
                  handleChange("usuarioRegistro", e.target.value)
                }
                disabled={isSubmitting}
                placeholder="Tu usuario"
              />
              {errors.usuarioRegistro && (
                <p className="text-sm text-destructive">
                  {errors.usuarioRegistro}
                </p>
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
                ? parametro
                  ? "Actualizando..."
                  : "Creando..."
                : parametro
                ? "Actualizar"
                : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}