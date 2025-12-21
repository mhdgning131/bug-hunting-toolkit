import { LucideIcon } from "lucide-react";

export type TabView = "generator" | "library" | "extensions" | "writeups" | "profile";

export interface CommandTool {
  id: string;
  name: string;
  category: string;
  description: string;
  commandTemplate: (target: string) => string;
}

export interface ResourceTool {
  name: string;
  description: string;
  link: string;
  category: string;
  tags: string[];
}

export interface Extension {
  name: string;
  description: string;
  firefoxLink: string;
  chromeLink: string;
  category: string;
  tags: string[];
}

export interface Writeup {
  title: string;
  subtitle: string;
  link: string;
  category: string;
  platform: string;
  date: string;
  readTime: string;
}

export interface Category {
  id: string;
  title: string;
  icon: LucideIcon;
  type: "web" | "system";
}
