export interface ResumeContact {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeSkill {
  id: string;
  name: string;
}

export interface ResumeCertification {
  id: string;
  name: string;
}

export interface ResumeLanguage {
  id: string;
  name: string;
  level: string;
}

export interface ResumeCourse {
  id: string;
  name: string;
  institution: string;
  completionDate: string;
  duration?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: ResumeContact;
  skills: ResumeSkill[];
  languages: ResumeLanguage[];
  certifications: ResumeCertification[];
  courses: ResumeCourse[];
  experiences: ResumeExperience[];
  education: ResumeEducation[];
}
