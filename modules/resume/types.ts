export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    links: string[];
  };
  summary: string;
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string[];
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
  }[];
}
