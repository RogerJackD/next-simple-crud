import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { ElementoEntidad } from "../../types/entidad-sistema";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface DetailDialogProps {
  elemento: ElementoEntidad | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailDialog({ elemento, open, onOpenChange }: DetailDialogProps) {
  if (!elemento) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: es 
      });
    } catch {
      return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalle del Elemento</DialogTitle>
          <DialogDescription>
            Información completa del elemento de entidad
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Información del Elemento</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-medium">{elemento.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{elemento.nombreElemento}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Visible</p>
                <Badge variant={elemento.visible === "1" ? "default" : "secondary"}>
                  {elemento.visible === "1" ? "Sí" : "No"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Editable</p>
                <Badge variant={elemento.editable === "1" ? "default" : "secondary"}>
                  {elemento.editable === "1" ? "Sí" : "No"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge variant={elemento.indicadorEstado === "A" ? "default" : "secondary"}>
                  {elemento.indicadorEstado === "A" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Información de la Entidad */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span>Entidad Asociada</span>
              <Badge variant="outline">{elemento.entidad.idEntidadSistema}</Badge>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Nombre Entidad</p>
                <p className="font-medium">{elemento.entidad.nombreEntidadSistema}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estado Entidad</p>
                <Badge variant={elemento.entidad.indicadorEstado === "A" ? "default" : "secondary"}>
                  {elemento.entidad.indicadorEstado === "A" ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Módulo Sistema</p>
                <p className="font-medium">{elemento.entidad.idModuloSistema}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Modo Sincronización</p>
                <p className="font-medium">{elemento.entidad.modoSincronizacion}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Filas por Página</p>
                <p className="font-medium">{elemento.entidad.numeroFilasPorPagina}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estado Importación</p>
                <Badge variant={elemento.entidad.estadoImportacion === "1" ? "default" : "secondary"}>
                  {elemento.entidad.estadoImportacion === "1" ? "Habilitado" : "Deshabilitado"}
                </Badge>
              </div>
            </div>

            {elemento.entidad.nombrePlantillaImportacion && (
              <div>
                <p className="text-sm text-muted-foreground">Plantilla Importación</p>
                <p className="text-sm font-mono bg-background p-2 rounded mt-1">
                  {elemento.entidad.nombrePlantillaImportacion}
                </p>
              </div>
            )}
          </div>

          {/* Sincronización */}
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Sincronización</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes Iteración</p>
                <p className="font-medium">{elemento.entidad.numeroRegistrosPendientesIteracion}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Pendientes Sincronización</p>
                <p className="font-medium">{elemento.entidad.numeroRegistrosPendientesSincronizacion}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Última Descarga</p>
                <p className="text-sm">{formatDate(elemento.entidad.ultimaFechaDescarga)}</p>
                {getRelativeTime(elemento.entidad.ultimaFechaDescarga) && (
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(elemento.entidad.ultimaFechaDescarga)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Última Subida</p>
                <p className="text-sm">{formatDate(elemento.entidad.ultimaFechaSubida)}</p>
                {getRelativeTime(elemento.entidad.ultimaFechaSubida) && (
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(elemento.entidad.ultimaFechaSubida)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Auditoría del Elemento */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Auditoría del Elemento</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Usuario Registro</p>
                <p className="font-medium">{elemento.usuarioRegistro}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fecha Registro</p>
                <p className="text-sm">{formatDate(elemento.fechaRegistro)}</p>
                {getRelativeTime(elemento.fechaRegistro) && (
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(elemento.fechaRegistro)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Usuario Modificación</p>
                <p className="font-medium">{elemento.usuarioModificacion || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fecha Modificación</p>
                <p className="text-sm">{formatDate(elemento.fechaModificacion)}</p>
                {getRelativeTime(elemento.fechaModificacion) && (
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(elemento.fechaModificacion)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Auditoría de la Entidad */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Auditoría de la Entidad</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Usuario Registro</p>
                <p className="font-medium">{elemento.entidad.usuarioRegistro}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fecha Registro</p>
                <p className="text-sm">{formatDate(elemento.entidad.fechaRegistro)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Usuario Modificación</p>
                <p className="font-medium">{elemento.entidad.usuarioModificacion || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fecha Modificación</p>
                <p className="text-sm">{formatDate(elemento.entidad.fechaModificacion)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}