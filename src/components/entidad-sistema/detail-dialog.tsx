import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { EntidadSistema } from "../../types/entidad-sistema";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface DetailDialogProps {
  entidad: EntidadSistema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailDialog({ entidad, open, onOpenChange }: DetailDialogProps) {
  if (!entidad) return null;

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalle de la Entidad</DialogTitle>
          <DialogDescription>
            Información completa de la entidad del sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Información General</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-medium">{entidad.idEntidadSistema}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium text-lg">{entidad.nombreEntidadSistema}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Módulo Sistema</p>
                <p className="font-medium">{entidad.idModuloSistema}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge variant={entidad.indicadorEstado === "A" ? "default" : "secondary"}>
                  {entidad.indicadorEstado === "A" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Configuración</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Modo Sincronización</p>
                <Badge variant="outline">
                  {entidad.modoSincronizacion === "0" && "Manual"}
                  {entidad.modoSincronizacion === "1" && "Automático"}
                  {entidad.modoSincronizacion === "2" && "Híbrido"}
                  {entidad.modoSincronizacion === "3" && "Deshabilitado"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Filas por Página</p>
                <p className="font-medium">{entidad.numeroFilasPorPagina}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estado Importación</p>
                <Badge variant={entidad.estadoImportacion === "1" ? "default" : "secondary"}>
                  {entidad.estadoImportacion === "1" ? "Habilitado" : "Deshabilitado"}
                </Badge>
              </div>

              {entidad.nombrePlantillaImportacion && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Plantilla de Importación</p>
                  <p className="text-sm font-mono bg-background p-2 rounded mt-1 break-all">
                    {entidad.nombrePlantillaImportacion}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sincronización */}
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Sincronización</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Registros Pendientes (Iteración)</p>
                <p className="text-2xl font-bold text-amber-600">
                  {entidad.numeroRegistrosPendientesIteracion}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Registros Pendientes (Sincronización)</p>
                <p className="text-2xl font-bold text-amber-600">
                  {entidad.numeroRegistrosPendientesSincronizacion}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Última Descarga</p>
                <p className="text-sm">{formatDate(entidad.ultimaFechaDescarga)}</p>
                {getRelativeTime(entidad.ultimaFechaDescarga) && (
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(entidad.ultimaFechaDescarga)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Última Subida</p>
                <p className="text-sm">{formatDate(entidad.ultimaFechaSubida)}</p>
                {getRelativeTime(entidad.ultimaFechaSubida) && (
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(entidad.ultimaFechaSubida)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Elementos Asociados */}
          {entidad.elementos && entidad.elementos.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg mb-3">
                Elementos Asociados ({entidad.elementos.length})
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {entidad.elementos.map((elemento) => (
                  <div
                    key={elemento.id}
                    className="p-2 bg-background rounded border text-sm"
                  >
                    <p className="font-medium truncate">{elemento.nombreElemento}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant={elemento.visible === "1" ? "default" : "secondary"} className="text-xs">
                        {elemento.visible === "1" ? "Visible" : "Oculto"}
                      </Badge>
                      <Badge variant={elemento.indicadorEstado === "A" ? "default" : "secondary"} className="text-xs">
                        {elemento.indicadorEstado}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auditoría */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Auditoría</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Usuario Registro</p>
                <p className="font-medium">{entidad.usuarioRegistro}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fecha Registro</p>
                <p className="text-sm">{formatDate(entidad.fechaRegistro)}</p>
                {getRelativeTime(entidad.fechaRegistro) && (
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(entidad.fechaRegistro)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Usuario Modificación</p>
                <p className="font-medium">{entidad.usuarioModificacion || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fecha Modificación</p>
                <p className="text-sm">{formatDate(entidad.fechaModificacion)}</p>
                {getRelativeTime(entidad.fechaModificacion) && (
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(entidad.fechaModificacion)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}