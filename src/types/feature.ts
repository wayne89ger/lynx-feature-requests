export interface Comment {
  id: number;
  text: string;
  timestamp: string;
  reporter: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  status: "new" | "review" | "progress" | "completed";
  product: string;
  location?: string;
  votes: number;
  comments: Comment[];
  attachment?: string;
  reporter: string;
  experimentOwner?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Bug {
  id: number;
  title: string;
  current_situation: string;
  expected_behavior: string;
  url: string;
  status: "new" | "review" | "progress" | "completed";
  product: string;
  votes: number;
  reporter: string;
  created_at?: string;
  updated_at?: string;
}