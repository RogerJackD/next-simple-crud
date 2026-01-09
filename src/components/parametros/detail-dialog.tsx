"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { ParametroSistema } from "../../types/parametro-sistema";

interface DetailDialogProps {
  parametro: ParametroSistema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailDialog({ parametro, open, onOpenChange }: DetailDialogProps) {
  if (!parametro) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle del Parámetro</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">ID:</span>
            <span className="col-span-2">{parametro.idParametroSistema}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">Nombre:</span>
            <span className="col-span-2">{parametro.nombreParametroSistema}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">Valor:</span>
            <span className="col-span-2">{parametro.valorParametroSistema}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">Grupo Parámetro:</span>
            <span className="col-span-2">{parametro.idGrupoParametro || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">Entidad Sistema:</span>
            <span className="col-span-2">{parametro.idEntidadSistema}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">Estado:</span>
            <div className="col-span-2">
              <Badge variant={parametro.indicadorEstado === "A" ? "default" : "secondary"}>
                {parametro.indicadorEstado === "A" ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">Usuario Registro:</span>
            <span className="col-span-2">{parametro.usuarioRegistro}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">Fecha Registro:</span>
            <span className="col-span-2">
              {new Date(parametro.fechaRegistro).toLocaleString("es-PE")}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">Usuario Modificación:</span>
            <span className="col-span-2">{parametro.usuarioModificacion || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">Fecha Modificación:</span>
            <span className="col-span-2">
              {parametro.fechaModificacion
                ? new Date(parametro.fechaModificacion).toLocaleString("es-PE")
                : "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm text-muted-foreground">Estado Sincronización:</span>
            <span className="col-span-2">{parametro.estadoSincronizacion}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}