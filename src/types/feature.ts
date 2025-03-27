
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
  status: "new" | "progress" | "completed" | "unresolvable";
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
  deleted?: boolean;
  deleted_at?: string | null;
  // Optional fields for feature details
  hypothesis?: string;
  expectedOutcome?: string;
  expected_outcome?: string; // Keep for backward compatibility
  type?: string;
  experimentOwner?: string;
  experiment_owner?: string; // Keep for backward compatibility
  timeframe?: string;
  metrics?: string[];
  userResearch?: string;
  user_research?: string; // Keep for backward compatibility
  mvp?: string;
  rice_score?: {
    reach: number;
    impact: number;
    confidence: number;
    effort: number;
    total: number;
  };
  // Bug-related fields
  current_situation?: string;
  expected_behavior?: string;
  url?: string;
}

export interface Bug {
  id: number;
  title: string;
  current_situation: string;
  expected_behavior: string;
  url: string;
  status: "new" | "progress" | "completed" | "unresolvable";
  product: string;
  votes: number;
  reporter: string;
  created_at?: string;
  updated_at?: string;
}
