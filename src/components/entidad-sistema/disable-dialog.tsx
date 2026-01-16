import { useState } from "react";
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
import { AlertTriangle } from "lucide-react";
import { EntidadSistema } from "../../types/entidad-sistema";

interface DisableDialogProps {
  entidad: EntidadSistema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (usuarioModificacion: string) => void;
  isDisabling: boolean;
}

export function DisableDialog({
  entidad,
  open,
  onOpenChange,
  onConfirm,
  isDisabling,
}: DisableDialogProps) {
  const [usuarioModificacion, setUsuarioModificacion] = useState("");

  const handleConfirm = () => {
    if (!usuarioModificacion.trim()) {
      alert("Por favor, ingresa tu usuario");
      return;
    }
    onConfirm(usuarioModificacion);
    setUsuarioModificacion("");
  };

  const handleCancel = () => {
    setUsuarioModificacion("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Deshabilitar Entidad
          </DialogTitle>
          <DialogDescription>
            Esta acción cambiará el estado de la entidad a Inactivo (E).
          </DialogDescription>
        </DialogHeader>

        {entidad && (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ID:</span>
                <span className="text-sm">{entidad.idEntidadSistema}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Nombre:</span>
                <span className="text-sm font-semibold">{entidad.nombreEntidadSistema}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Módulo:</span>
                <span className="text-sm">{entidad.idModuloSistema}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Elementos Asociados:</span>
                <span className="text-sm">{entidad.elementos?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Estado Actual:</span>
                <span className="text-sm font-semibold text-green-600">
                  {entidad.indicadorEstado === "A" ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            {entidad.elementos && entidad.elementos.length > 0 && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-3 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ Esta entidad tiene {entidad.elementos.length} elemento(s) asociado(s). Al deshabilitarla, podrían verse afectados.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="usuarioModificacion">
                Usuario que realiza la modificación *
              </Label>
              <Input
                id="usuarioModificacion"
                placeholder="Ingresa tu usuario"
                value={usuarioModificacion}
                onChange={(e) => setUsuarioModificacion(e.target.value)}
                disabled={isDisabling}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Este campo es requerido para auditoría
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDisabling}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDisabling}
          >
            {isDisabling ? "Deshabilitando..." : "Deshabilitar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}