export interface Settings {
  id: string;
  organizationId: string;
  theme: Theme;
  layout: Layout;
  card: Card;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  fontFamily?: string;
}

export interface Layout {
  style: string;
  config: Config;
}

export enum ImageOrientation {
  Landscape = 'landscape',
  Portrait = 'portrait',
}
export interface Config {
  columns: number;
  rows: number;
  spacing: number;
  itemsPerPage: number;
  autoPlay: boolean;
  showIndicators: boolean;
  imageOrientation: ImageOrientation;
}

export interface Card {
  style: string;
  borderRadius: number;
}

