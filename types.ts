
export interface NewsItem {
  title: string;
  source: string;
  url: string;
  snippet: string;
  category?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  description: string;
}

export interface DashboardState {
  news: NewsItem[];
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string;
}
