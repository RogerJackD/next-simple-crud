export interface ParametroSistema {
    idParametroSistema: number;
    nombreParametroSistema: string;
    valorParametroSistema: string;
    idGrupoParametro?: number;
    idEntidadSistema: number;
    indicadorEstado: string;
    usuarioRegistro: string;
    fechaRegistro: string;
    usuarioModificacion?: string;
    fechaModificacion?: string;
    estadoSincronizacion: string;
}

