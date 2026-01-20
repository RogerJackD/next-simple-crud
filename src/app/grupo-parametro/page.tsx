'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { grupoParametroService } from '@/src/services/grupo-parametro.service';
import { ViewDialog } from '@/src/components/grupo-parametro/view-dialog';
import { CreateDialog } from '@/src/components/grupo-parametro/create-dialog';
import { EditDialog } from '@/src/components/grupo-parametro/edit-dialog';
import { GrupoParametro } from '@/src/types/grupo-parametro';

const RUC_STORAGE_KEY = 'current_ruc';

export default function GrupoParametroPage() {
  const router = useRouter();
  const [grupoParametros, setGrupoParametros] = useState<GrupoParametro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para los diálogos
  const [selectedGrupo, setSelectedGrupo] = useState<GrupoParametro | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadGrupoParametros();
  }, []);

  const loadGrupoParametros = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await grupoParametroService.getAll();
      setGrupoParametros(data);
    } catch (error) {
      console.error('Error al cargar grupos de parámetros:', error);
      setError('No se pudieron cargar los grupos de parámetros');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(RUC_STORAGE_KEY);
    router.push('/login');
  };

  const handleCreate = () => {
    setCreateDialogOpen(true);
  };

  const handleView = async (grupo: GrupoParametro) => {
    try {
      const data = await grupoParametroService.getById(grupo.idGrupoParametro);
      setSelectedGrupo(data);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('Error al obtener detalles:', error);
      alert('No se pudieron obtener los detalles del grupo');
    }
  };

  const handleEdit = (grupo: GrupoParametro) => {
    setSelectedGrupo(grupo);
    setEditDialogOpen(true);
  };

  const handleDelete = async (grupo: GrupoParametro) => {
    if (!confirm(`¿Está seguro de desactivar el grupo "${grupo.nombreGrupoParametro}"?`)) {
      return;
    }

    const usuarioModificacion = prompt('Ingrese su usuario:');
    if (!usuarioModificacion) {
      return;
    }

    try {
      await grupoParametroService.toggleEstado(grupo.idGrupoParametro, {
        indicadorEstado: 'E',
        usuarioModificacion,
      });
      alert('Grupo de parámetro desactivado correctamente');
      loadGrupoParametros();
    } catch (error) {
      console.error('Error al desactivar grupo:', error);
      alert('No se pudo desactivar el grupo de parámetro');
    }
  };

  const handleCreateSubmit = async (data: { nombreGrupoParametro: string; usuarioRegistro: string }) => {
    try {
      await grupoParametroService.create(data);
      alert('Grupo de parámetro creado correctamente');
      loadGrupoParametros();
    } catch (error) {
      console.error('Error al crear:', error);
      alert('No se pudo crear el grupo de parámetro');
      throw error;
    }
  };

  const handleEditSubmit = async (id: number, data: { nombreGrupoParametro: string; usuarioModificacion: string }) => {
    try {
      await grupoParametroService.update(id, data);
      alert('Grupo de parámetro actualizado correctamente');
      loadGrupoParametros();
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('No se pudo actualizar el grupo de parámetro');
      throw error;
    }
  };

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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando grupos de parámetros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadGrupoParametros}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Grupos de Parámetros del Sistema</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              RUC: {typeof window !== 'undefined' ? localStorage.getItem(RUC_STORAGE_KEY) : '-'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Grupo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {grupoParametros.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay grupos de parámetros disponibles
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre del Grupo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Usuario Registro</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Última Modificación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grupoParametros.map((grupo) => (
                  <TableRow key={grupo.idGrupoParametro}>
                    <TableCell className="font-medium">
                      {grupo.idGrupoParametro}
                    </TableCell>
                    <TableCell>{grupo.nombreGrupoParametro}</TableCell>
                    <TableCell>
                      <Badge
                        variant={grupo.indicadorEstado === 'A' ? 'default' : 'secondary'}
                      >
                        {grupo.indicadorEstado === 'A' ? 'Activo' : 'Eliminado'}
                      </Badge>
                    </TableCell>
                    <TableCell>{grupo.usuarioRegistro || '-'}</TableCell>
                    <TableCell>{formatDate(grupo.fechaRegistro)}</TableCell>
                    <TableCell>
                      {grupo.fechaModificacion
                        ? formatDate(grupo.fechaModificacion)
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(grupo)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(grupo)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(grupo)}
                          title="Desactivar"
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogos */}
      <ViewDialog
        grupo={selectedGrupo}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
      <CreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSubmit}
      />
      <EditDialog
        grupo={selectedGrupo}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
}