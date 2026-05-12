export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  avatarUrl: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url: string;
  tech: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  languages: LanguageItem[];
}

export type TemplateId = "modern" | "classic" | "minimal";

export const emptyResume = (): ResumeData => ({
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
    avatarUrl: "",
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
});

export const uid = () => Math.random().toString(36).slice(2, 10);
