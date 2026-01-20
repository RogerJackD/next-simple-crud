import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { nombreGrupoParametro: string; usuarioRegistro: string }) => Promise<void>;
}

export function CreateDialog({ open, onOpenChange, onSubmit }: CreateDialogProps) {
  const [nombreGrupoParametro, setNombreGrupoParametro] = useState('');
  const [usuarioRegistro, setUsuarioRegistro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombreGrupoParametro.trim() || !usuarioRegistro.trim()) {
      alert('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ nombreGrupoParametro, usuarioRegistro });
      setNombreGrupoParametro('');
      setUsuarioRegistro('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error al crear:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Grupo de Parámetro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
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
              <Label htmlFor="usuarioRegistro">Usuario Registro *</Label>
              <Input
                id="usuarioRegistro"
                value={usuarioRegistro}
                onChange={(e) => setUsuarioRegistro(e.target.value)}
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
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}