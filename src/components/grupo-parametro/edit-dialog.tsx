import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { GrupoParametro } from '@/src/types/grupo-parametro';

interface EditDialogProps {
  grupo: GrupoParametro | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: number, data: { nombreGrupoParametro: string; usuarioModificacion: string }) => Promise<void>;
}

export function EditDialog({ grupo, open, onOpenChange, onSubmit }: EditDialogProps) {
  const [nombreGrupoParametro, setNombreGrupoParametro] = useState('');
  const [usuarioModificacion, setUsuarioModificacion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (grupo) {
      setNombreGrupoParametro(grupo.nombreGrupoParametro);
      setUsuarioModificacion('');
    }
  }, [grupo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!grupo || !nombreGrupoParametro.trim() || !usuarioModificacion.trim()) {
      alert('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(grupo.idGrupoParametro, { nombreGrupoParametro, usuarioModificacion });
      onOpenChange(false);
    } catch (error) {
      console.error('Error al editar:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!grupo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Grupo de Parámetro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ID</Label>
              <Input value={grupo.idGrupoParametro} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombreGrupoParametro">Nombre del Grupo *</Label>
              <Input
                id="nombreGrupoParametro"
                value={nombreGrupoParametro}
                onChange={(e) => setNombreGrupoParametro(e.target.value)}
                placeholder="Ingrese el nombre del grupo"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usuarioModificacion">Usuario Modificación *</Label>
              <Input
                id="usuarioModificacion"
                value={usuarioModificacion}
                onChange={(e) => setUsuarioModificacion(e.target.value)}
                placeholder="Ingrese el usuario"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}