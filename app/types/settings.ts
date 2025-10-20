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
}

export interface Layout {
  style: string;
  config: Config;
}

export interface Config {
  columns: number;
  rows: number;
  spacing: number;
  itemsPerPage: number;
  autoPlay: boolean;
  showIndicators: boolean;
}

export interface Card {
  style: string;
  borderRadius: number;
}

