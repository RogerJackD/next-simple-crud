import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Badge } from '@/src/components/ui/badge';
import { GrupoParametro } from '@/src/types/grupo-parametro';

interface ViewDialogProps {
  grupo: GrupoParametro | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDialog({ grupo, open, onOpenChange }: ViewDialogProps) {
  if (!grupo) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalles del Grupo de Parámetro</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">ID</label>
            <p className="text-base">{grupo.idGrupoParametro}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Nombre del Grupo</label>
            <p className="text-base">{grupo.nombreGrupoParametro}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <div className="mt-1">
              <Badge variant={grupo.indicadorEstado === 'A' ? 'default' : 'secondary'}>
                {grupo.indicadorEstado === 'A' ? 'Activo' : 'Eliminado'}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Usuario Registro</label>
            <p className="text-base">{grupo.usuarioRegistro || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha Registro</label>
            <p className="text-base">{formatDate(grupo.fechaRegistro)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Usuario Modificación</label>
            <p className="text-base">{grupo.usuarioModificacion || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha Modificación</label>
            <p className="text-base">{formatDate(grupo.fechaModificacion)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}