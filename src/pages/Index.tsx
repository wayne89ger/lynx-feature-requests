<lov-code>
import { useState } from "react";
import { FeatureCard } from "@/components/feature-request/FeatureCard";
import { FeatureForm } from "@/components/feature-request/FeatureForm";
import { BugReportForm } from "@/components/bug-report/BugReportForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { EditFeatureForm } from "@/components/feature-request/EditFeatureForm";

interface Comment {
  id: number;
  text: string;
  timestamp: string;
}

interface Feature {
  id: number;
  title: string;
  description: string;
  status: "new" | "review" | "progress" | "completed";
  product: string;
  location?: string;
  votes: number;
  comments: Comment[];
  attachment