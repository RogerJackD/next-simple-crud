"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { ParametroSistema, CreateParametroSistemaDto, UpdateParametroSistemaDto } from "../../types/parametro-sistema";

interface FormDialogProps {
  parametro: ParametroSistema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateParametroSistemaDto | UpdateParametroSistemaDto) => void;
  isSubmitting?: boolean;
}

export function FormDialog({
  parametro,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: FormDialogProps) {
  const [formData, setFormData] = useState({
    nombreParametroSistema: "",
    valorParametroSistema: "",
    idGrupoParametro: "",
    idEntidadSistema: "",
    indicadorEstado: "A" as "A" | "I",
    usuario: "admin",
  });

  useEffect(() => {
    if (parametro) {
      setFormData({
        nombreParametroSistema: parametro.nombreParametroSistema,
        valorParametroSistema: parametro.valorParametroSistema,
        idGrupoParametro: parametro.idGrupoParametro?.toString() || "",
        idEntidadSistema: parametro.idEntidadSistema.toString(),
        indicadorEstado: parametro.indicadorEstado as "A" | "I",
        usuario: "admin",
      });
    } else {
      setFormData({
        nombreParametroSistema: "",
        valorParametroSistema: "",
        idGrupoParametro: "",
        idEntidadSistema: "",
        indicadorEstado: "A",
        usuario: "admin",
      });
    }
  }, [parametro, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (parametro) {
      // UPDATE - Solo enviar campos modificables
      const updateData: UpdateParametroSistemaDto = {
        usuarioModificacion: formData.usuario,
      };

      if (formData.nombreParametroSistema !== parametro.nombreParametroSistema) {
        updateData.nombreParametroSistema = formData.nombreParametroSistema;
      }
      if (formData.valorParametroSistema !== parametro.valorParametroSistema) {
        updateData.valorParametroSistema = formData.valorParametroSistema;
      }
      if (formData.indicadorEstado !== parametro.indicadorEstado) {
        updateData.indicadorEstado = formData.indicadorEstado;
      }
      
      // Manejar idGrupoParametro (puede ser null)
      const newGrupoId = formData.idGrupoParametro ? parseInt(formData.idGrupoParametro) : null;
      if (newGrupoId !== (parametro.idGrupoParametro || null)) {
        updateData.idGrupoParametro = newGrupoId;
      }

      onSubmit(updateData);
    } else {
      // CREATE
      const createData: CreateParametroSistemaDto = {
        nombreParametroSistema: formData.nombreParametroSistema,
        valorParametroSistema: formData.valorParametroSistema,
        idEntidadSistema: parseInt(formData.idEntidadSistema),
        indicadorEstado: formData.indicadorEstado,
        usuarioRegistro: formData.usuario,
      };

      if (formData.idGrupoParametro) {
        createData.idGrupoParametro = parseInt(formData.idGrupoParametro);
      }

      onSubmit(createData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {parametro ? "Editar Parámetro" : "Crear Parámetro"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del Parámetro *</Label>
              <Input
                id="nombre"
                value={formData.nombreParametroSistema}
                onChange={(e) =>
                  setFormData({ ...formData, nombreParametroSistema: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="valor">Valor del Parámetro *</Label>
              <Input
                id="valor"
                value={formData.valorParametroSistema}
                onChange={(e) =>
                  setFormData({ ...formData, valorParametroSistema: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="idGrupoParametro">ID Grupo Parámetro</Label>
              <Input
                id="idGrupoParametro"
                type="number"
                value={formData.idGrupoParametro}
                onChange={(e) =>
                  setFormData({ ...formData, idGrupoParametro: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="idEntidadSistema">ID Entidad Sistema *</Label>
              <Input
                id="idEntidadSistema"
                type="number"
                value={formData.idEntidadSistema}
                onChange={(e) =>
                  setFormData({ ...formData, idEntidadSistema: e.target.value })
                }
                required
                disabled={!!parametro}
              />
              {parametro && (
                <p className="text-xs text-muted-foreground">
                  Este campo no se puede modificar
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={formData.indicadorEstado}
                onValueChange={(value: "A" | "I") =>
                  setFormData({ ...formData, indicadorEstado: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Activo</SelectItem>
                  <SelectItem value="I">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {isSubmitting ? "Guardando..." : parametro ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}