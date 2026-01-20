export interface GrupoParametro {
  idGrupoParametro: number;
  nombreGrupoParametro: string;
  indicadorEstado: string; // 'A' = Activo, 'E'  = Inactivo
  usuarioRegistro: string;
  fechaRegistro: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
}


export interface CreateGrupoParametroDto {
  nombreGrupoParametro: string;
  usuarioRegistro: string;
}


export interface UpdateGrupoParametroDto {
  nombreGrupoParametro?: string;
  usuarioModificacion: string; 
}


export interface DisableGrupoParametroDto {
  indicadorEstado: 'A' | 'E';
  usuarioModificacion: string;
}