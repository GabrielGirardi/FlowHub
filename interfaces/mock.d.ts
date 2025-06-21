declare global {
  export type NavItem = {
    name: string;
    icon: React.ElementType;
    path: string;
    category?: string;
  };

  export type LiveStream = {
    id: string;
    name: string;
    url: string;
    description: string;
  };

  export type Sounds = {
    id: string;
    name: string;
    icon: typeof Cloud;
    color: string;
    audio?: HTMLAudioElement;
    url: string;
  };

  export type LofiStation = {
    name: string;
    url: string;
    description: string;
  };

  export type Currency = {
    code: string;
    name: string;
    symbol: string;
    flag: string;
  };

  export type CurrencyCode =
    | "USD"
    | "EUR"
    | "BRL"
    | "GBP"
    | "JPY"
    | "CNY"
    | "AUD"
    | "CAD"
    | "CHF"
    | "ARS"
    | "MXN"
    | "INR"
    | "KRW"
    | "SGD"
    | "NOK"
    | "SEK"
    | "DKK"
    | "PLN"
    | "CZK"
    | "HUF";

  export type ExchangeRates = {
    [from in CurrencyCode]?: {
      [to in CurrencyCode]?: number;
    };
  };

  export type AITool = {
    id: string;
    name: string;
    description: string;
    url: string;
    image: string;
    category: string[];
    tags: string[];
    pricing: "Free" | "Freemium" | "Paid" | "Free Trial";
    rating?: number;
    featured?: boolean;
  };

  export type CategoryKey =
    | "all"
    | "chatbots"
    | "development"
    | "images"
    | "productivity"
    | "research"
    | "audio"
    | "video"
    | "favorites";

  export type CategoryMap = Record<CategoryKey, string>;

  export type Categories = {
    id: string;
    name: string;
    icon: React.ElementType;
  };

  export type LanguageValue =
    | "javascript"
    | "typescript"
    | "python"
    | "css"
    | "markup"
    | "php"
    | "java"
    | "c"
    | "go";

  export type LanguageOption = {
    value: LanguageValue;
    label: string;
  };

  export type DeployDefaultItems = {
    id: string;
    text: string;
    completed: boolean;
  };

  export type DonationFeatures = {
    title: string;
    description: string;
  };

  export type DataTypeOptionValue =
    | "name"
    | "email"
    | "phone"
    | "address"
    | "company"
    | "job"
    | "creditCard"
    | "product"
    | "image"
    | "uuid"
    | "date";

  export type DataTypeOption = {
    value: DataTypeOptionValue;
    label: string;
    icon: string;
  };

  export type Category = {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    color: string;
  };

  export type Tool = {
    name: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    category: string;
    highlight?: boolean;
  };

  export type TaskPriority = "low" | "medium" | "high";
  export type KanbanColumn = "todo" | "inProgress" | "review" | "done";

  export type KanbanTask = {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    column: KanbanColumn;
    createdAt: string;
    dueDate?: string;
  };

  export type KanbanColumnConfig = {
    id: KanbanColumn;
    title: string;
    color: string;
    bgColor: string;
    icon: React.ComponentType<any>;
  };

  export type PriorityLevel = "low" | "medium" | "high";

  export interface PriorityConfigItem {
    label: string;
    color: string;
  }

  export type PriorityConfig = Record<PriorityLevel, PriorityConfigItem>;

  export type CategoriesNews = {
    id: "top" | "new" | "best";
    name: string;
    icon: React.ElementType;
  };

  export type YouTubeVideo = {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
    publishedAt: string;
  };

  export interface Mimic {
    modules: NavItem[];
    liveStreams: LiveStream[];
    sounds: Sounds[];
    lofiStations: LofiStation[];
    weather: { [key: number]: string };
    pages: {
      aiTools: {
        tools: AITool[];
        categories: Categories[];
        categoryMap: CategoryMap;
      };
      codeSnippets: {
        languagesOptions: LanguageOption[];
      };
      currencyConverter: {
        currencies: Currency[];
        sampleRates: ExchangeRates;
      };
      deployChecklist: {
        defaultItems: DeployDefaultItems[];
      };
      donation: {
        features: DonationFeatures[];
      };
      fakerData: {
        dataOptions: DataTypeOption[];
      };
      welcome: {
        categories: Category[];
        tools: Tool[];
      };
      kanban: {
        columnsConfig: KanbanColumnConfig[];
        priorityConfig: PriorityConfig;
      };
      techNews: {
        categories: CategoriesNews[];
        fallbackImage: string;
      };
      youtubePlayer: {
        sampleVideos: YouTubeVideo[];
      };
    };
  }
}

export {};
