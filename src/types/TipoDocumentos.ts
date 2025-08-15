export interface TipoDocumento {
  id: number;
  name: string;
  description: string;
}

export interface APIGetTipoDocumentos {
  count: number;
  next: string | null;
  previous: string | null;
  results: TipoDocumento[];
}

export interface APICreateTipoDocumento {
  id: number;
  name: string;
  description: string;
}

export type APIGetDetailTipoDocumento = TipoDocumento;
export type APIUpdateTipoDocumento = APICreateTipoDocumento;
export type APIDeleteTipoDocumento = void;