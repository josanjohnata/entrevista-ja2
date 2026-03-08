
import { ResumeData, ResumeContact, ResumeExperience, ResumeEducation, ResumeSkill, ResumeLanguage, ResumeCourse } from '../../domain/resume/types';
import { UserProfile } from '../../types';

const convertDateFormat = (dateStr: string): string => {
  if (!dateStr) return '';
  
  if (/^\d{4}-\d{2}$/.test(dateStr)) return dateStr;
  
  if (/^\d{2}\/\d{4}$/.test(dateStr)) {
    const [month, year] = dateStr.split('/');
    return `${year}-${month}`;
  }
  
  return dateStr;
};

const mapLanguageLevel = (proficiency?: string): string => {
  const proficiencyMap: Record<string, string> = {
    'beginner': 'Básico',
    'intermediate': 'Intermediário',
    'advanced': 'Avançado',
    'fluent': 'Fluente',
    'native': 'Nativo',
  };

  return proficiency ? (proficiencyMap[proficiency.toLowerCase()] || proficiency) : 'Intermediário';
};

export class ProfileToResumeAdapter {
  static convert(profile: UserProfile | null, userEmail?: string): ResumeData {
    if (!profile) {
      return this.getEmptyResumeData();
    }

    const contact: ResumeContact = {
      email: userEmail || profile.email || '',
      phone: profile.phone || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      location: profile.location || '',
    };

    const experiences: ResumeExperience[] = (profile.experiences || []).map((exp) => ({
      id: exp.id || String(Date.now() + Math.random()),
      company: exp.company || '',
      position: exp.position || '',
      startDate: convertDateFormat(exp.startDate || ''),
      endDate: convertDateFormat(exp.endDate || ''),
      current: exp.isCurrent || false,
      description: exp.description || '',
      location: exp.location || '',
    }));

    const education: ResumeEducation[] = (profile.education || []).map((edu) => ({
      id: edu.id || String(Date.now() + Math.random()),
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.fieldOfStudy || '',
      startDate: convertDateFormat(edu.startDate || ''),
      endDate: convertDateFormat(edu.endDate || ''),
      description: edu.description || '',
    }));

    const skills: ResumeSkill[] = (profile.skills || []).map((skill) => ({
      id: String(Date.now() + Math.random()),
      name: skill,
    }));

    const languages: ResumeLanguage[] = (profile.languages || []).map((lang) => ({
      id: lang.id || String(Date.now() + Math.random()),
      name: lang.language || '',
      level: mapLanguageLevel(lang.proficiency),
    }));

    const certifications = (profile.certifications || []).map((cert) => ({
      id: String(Date.now() + Math.random()),
      name: cert,
    }));

    const courses: ResumeCourse[] = (profile.courses || []).map((course) => ({
      id: course.id || String(Date.now() + Math.random()),
      name: course.name || '',
      institution: course.institution || '',
      completionDate: convertDateFormat(course.completionDate || ''),
      duration: course.duration || '',
    }));

    return {
      name: profile.displayName || '',
      title: profile.professionalTitle || '',
      summary: profile.about || '',
      contact,
      skills,
      languages,
      certifications,
      courses,
      experiences,
      education,
    };
  }

  static convertBack(resumeData: ResumeData): Partial<UserProfile> {
    const experiences = resumeData.experiences.map((exp) => ({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      startDate: this.convertToDisplayFormat(exp.startDate),
      endDate: this.convertToDisplayFormat(exp.endDate),
      isCurrent: exp.current,
      description: exp.description,
      location: exp.location,
    }));

    const education = resumeData.education.map((edu) => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.field,
      startDate: this.convertToDisplayFormat(edu.startDate),
      endDate: this.convertToDisplayFormat(edu.endDate),
      description: edu.description,
    }));

    const skills = resumeData.skills.map((skill) => skill.name);

    const languages = resumeData.languages.map((lang) => ({
      id: lang.id,
      language: lang.name,
      proficiency: this.mapLevelToProficiency(lang.level),
    }));

    const certifications = resumeData.certifications.map((cert) => cert.name);

    const courses = resumeData.courses.map((course) => ({
      id: course.id,
      name: course.name,
      institution: course.institution,
      completionDate: this.convertToDisplayFormat(course.completionDate),
      duration: course.duration,
    }));

    return {
      displayName: resumeData.name,
      professionalTitle: resumeData.title,
      about: resumeData.summary,
      phone: resumeData.contact.phone,
      location: resumeData.contact.location,
      linkedin: resumeData.contact.linkedin,
      github: resumeData.contact.github,
      experiences,
      education,
      skills,
      languages,
      certifications,
      courses,
    };
  }

  private static convertToDisplayFormat(dateStr: string): string {
    if (!dateStr) return '';
    
    if (/^\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
    
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      const [year, month] = dateStr.split('-');
      return `${month}/${year}`;
    }
    
    return dateStr;
  }

  private static mapLevelToProficiency(level: string): string {
    const levelMap: Record<string, string> = {
      'Básico': 'beginner',
      'Intermediário': 'intermediate',
      'Avançado': 'advanced',
      'Fluente': 'fluent',
      'Nativo': 'native',
    };

    return levelMap[level] || 'intermediate';
  }

  private static getEmptyResumeData(): ResumeData {
    return {
      name: '',
      title: '',
      summary: '',
      contact: {
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        location: '',
      },
      skills: [],
      languages: [],
      certifications: [],
      courses: [],
      experiences: [],
      education: [],
    };
  }
}
