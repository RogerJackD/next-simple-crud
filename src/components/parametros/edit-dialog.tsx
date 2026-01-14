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
import { ParametroSistema } from "../../types/parametro-sistema";

interface DisableDialogProps {
  parametro: ParametroSistema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (usuarioModificacion: string) => void;
  isDisabling: boolean;
}

export function DisableDialog({
  parametro,
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
            Deshabilitar Parámetro
          </DialogTitle>
          <DialogDescription>
            Esta acción cambiará el estado del parámetro a inactivo.
          </DialogDescription>
        </DialogHeader>

        {parametro && (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ID:</span>
                <span className="text-sm">{parametro.idParametroSistema}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Nombre:</span>
                <span className="text-sm">{parametro.nombreParametroSistema}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Estado Actual:</span>
                <span className="text-sm font-semibold text-green-600">
                  {parametro.indicadorEstado === "A" ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

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
            disabled={isDisabling || !usuarioModificacion.trim()}
          >
            {isDisabling ? "Deshabilitando..." : "Deshabilitar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}