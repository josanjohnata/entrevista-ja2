export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: 'basic' | 'intermediate' | 'professional' | 'native';
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  completionDate?: string;
  duration?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  
  professionalTitle?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  
  about?: string;
  
  experiences?: Experience[];
  
  education?: Education[];
  
  languages?: Language[];
  
  courses?: Course[];
  
  skills?: string[];
  
  certifications?: string[];
  
  resumeURL?: string;
  resumeName?: string;
  
  profileCompleted: boolean;
  updatedAt: Date;
}
