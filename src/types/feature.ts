
export interface Comment {
  id: number;
  text: string;
  timestamp: string;
  reporter: string;
  attachment?: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  status: "new" | "progress" | "completed";
  product: string;
  squad?: string;
  location?: string;
  votes: number;
  comments: Comment[];
  attachment?: string;
  urgency: "low" | "medium" | "high";
  reporter: string;
  created_at: string;
  updated_at: string;
  squads: string[]; // This was previously named tags
  // Optional fields for feature details
  hypothesis?: string;
  expected_outcome?: string;
  type?: string;
  experiment_owner?: string;
  timeframe?: string;
  metrics?: string[];
  user_research?: string;
  mvp?: string;
  rice_score?: {
    reach: number;
    impact: number;
    confidence: number;
    effort: number;
    total: number;
  };
}

export interface Bug {
  id: number;
  title: string;
  current_situation: string;
  expected_behavior: string;
  url: string;
  status: "new" | "progress" | "completed";
  product: string;
  votes: number;
  reporter: string;
  created_at?: string;
  updated_at?: string;
}
