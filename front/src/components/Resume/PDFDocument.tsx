import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '../../domain/resume/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #0A66C2',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  title: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
  },
  contactSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  contactItem: {
    fontSize: 9,
    color: '#666666',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A66C2',
    marginTop: 15,
    marginBottom: 8,
    borderBottom: '1 solid #E0E0E0',
    paddingBottom: 3,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
    textAlign: 'justify',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillItem: {
    fontSize: 9,
    color: '#333333',
  },
  experienceItem: {
    marginBottom: 12,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  position: {
    fontSize: 10,
    color: '#0A66C2',
    marginBottom: 2,
  },
  dateLocation: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 5,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#333333',
  },
  educationItem: {
    marginBottom: 10,
  },
  institutionName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  degreeInfo: {
    fontSize: 9,
    color: '#666666',
    marginTop: 2,
  },
  languageItem: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 3,
  },
  certificationItem: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 3,
  },
  courseItem: {
    marginBottom: 8,
  },
  courseName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  courseInstitution: {
    fontSize: 9,
    color: '#0A66C2',
    marginTop: 1,
  },
  courseInfo: {
    fontSize: 9,
    color: '#666666',
    marginTop: 2,
  },
  sidebar: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  sidebarTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0A66C2',
    marginBottom: 8,
  },
});

interface PDFDocumentProps {
  data: ResumeData;
}

export const PDFDocument = ({ data }: PDFDocumentProps) => {
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    
    if (/^\d{4}-\d{2}(-\d{2})?$/.test(dateStr)) {
      return new Date(dateStr);
    }
    
    const slashMatch = dateStr.match(/^(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      return new Date(parseInt(slashMatch[2]), parseInt(slashMatch[1]) - 1, 1);
    }
    
    const monthNames: Record<string, number> = {
      'jan': 0, 'janeiro': 0, 'january': 0,
      'fev': 1, 'fevereiro': 1, 'february': 1,
      'mar': 2, 'março': 2, 'marco': 2, 'march': 2,
      'abr': 3, 'abril': 3, 'april': 3,
      'mai': 4, 'maio': 4, 'may': 4,
      'jun': 5, 'junho': 5, 'june': 5,
      'jul': 6, 'julho': 6, 'july': 6,
      'ago': 7, 'agosto': 7, 'august': 7,
      'set': 8, 'setembro': 8, 'september': 8,
      'out': 9, 'outubro': 9, 'october': 9,
      'nov': 10, 'novembro': 10, 'november': 10,
      'dez': 11, 'dezembro': 11, 'december': 11,
    };
    
    const textMatch = dateStr.toLowerCase().match(/([a-zç]+)\s*(?:de\s*)?(\d{4})/);
    if (textMatch) {
      const monthNum = monthNames[textMatch[1]];
      if (monthNum !== undefined) {
        return new Date(parseInt(textMatch[2]), monthNum, 1);
      }
    }
    
    const yearMatch = dateStr.match(/(\d{4})/);
    if (yearMatch) {
      return new Date(parseInt(yearMatch[1]), 0, 1);
    }
    
    return null;
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    
    const parsed = parseDate(date);
    if (parsed && !isNaN(parsed.getTime())) {
      const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      return `${months[parsed.getMonth()]} de ${parsed.getFullYear()}`;
    }
    
    return date;
  };

  const calculateDuration = (startDate: string, endDate: string, current: boolean) => {
    if (!startDate) return '';
    
    const start = parseDate(startDate);
    if (!start || isNaN(start.getTime())) return '';
    
    const end = current ? new Date() : parseDate(endDate);
    if (!end || isNaN(end.getTime())) return '';
    
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
    if (totalMonths < 0) return '';
    
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    
    if (years === 0) return `${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    return `${years} ${years === 1 ? 'ano' : 'anos'} ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
  };

  const validSkills = data.skills.filter(skill => skill.name?.trim());
  const validLanguages = data.languages.filter(lang => lang.name?.trim());
  const validCertifications = data.certifications.filter(cert => cert.name?.trim());
  const validCourses = data.courses.filter(course => course.name?.trim());
  const validExperiences = data.experiences.filter(exp => exp.company?.trim() || exp.position?.trim());
  const validEducation = data.education.filter(edu => edu.institution?.trim());

  const hasSidebarContent = validSkills.length > 0 || validLanguages.length > 0 || validCertifications.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {data.name?.trim() && <Text style={styles.name}>{data.name}</Text>}
          {data.title?.trim() && <Text style={styles.title}>{data.title}</Text>}
          
          {(data.contact.email || data.contact.phone || data.contact.location) && (
            <View style={styles.contactSection}>
              {data.contact.email && <Text style={styles.contactItem}>{data.contact.email}</Text>}
              {data.contact.email && data.contact.phone && <Text style={styles.contactItem}>•</Text>}
              {data.contact.phone && <Text style={styles.contactItem}>{data.contact.phone}</Text>}
              {(data.contact.email || data.contact.phone) && data.contact.location && <Text style={styles.contactItem}>•</Text>}
              {data.contact.location && <Text style={styles.contactItem}>{data.contact.location}</Text>}
            </View>
          )}

          {(data.contact.linkedin || data.contact.github) && (
            <View style={styles.contactSection}>
              {data.contact.linkedin && (
                <Text style={styles.contactItem}>{data.contact.linkedin}</Text>
              )}
              {data.contact.linkedin && data.contact.github && (
                <Text style={styles.contactItem}>•</Text>
              )}
              {data.contact.github && (
                <Text style={styles.contactItem}>{data.contact.github}</Text>
              )}
            </View>
          )}
        </View>

        {hasSidebarContent && (
          <View style={styles.sidebar}>
            {validSkills.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.sidebarTitle}>Principais competências</Text>
                {validSkills.slice(0, 3).map((skill) => (
                  <Text key={skill.id} style={styles.skillItem}>• {skill.name}</Text>
                ))}
              </View>
            )}

            {validLanguages.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.sidebarTitle}>Idiomas</Text>
                {validLanguages.map((lang) => (
                  <Text key={lang.id} style={styles.languageItem}>• {lang.name} ({lang.level})</Text>
                ))}
              </View>
            )}

            {validCertifications.length > 0 && (
              <View>
                <Text style={styles.sidebarTitle}>Certificações</Text>
                {validCertifications.map((cert) => (
                  <Text key={cert.id} style={styles.certificationItem}>• {cert.name}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {data.summary?.trim() && (
          <View>
            <Text style={styles.sectionTitle}>Resumo</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {validSkills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Tecnologias</Text>
            <View style={styles.skillsContainer}>
              {validSkills.map((skill, index) => (
                <Text key={skill.id} style={styles.skillItem}>
                  {skill.name}{index < validSkills.length - 1 ? ' | ' : ''}
                </Text>
              ))}
            </View>
          </View>
        )}

        {validExperiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experiência</Text>
            {validExperiences.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                {exp.company && <Text style={styles.companyName}>{exp.company}</Text>}
                {exp.position && <Text style={styles.position}>{exp.position}</Text>}
                {exp.startDate && (
                  <Text style={styles.dateLocation}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Presente' : formatDate(exp.endDate)} 
                    {' '}({calculateDuration(exp.startDate, exp.endDate, exp.current)})
                  </Text>
                )}
                {exp.location?.trim() && (
                  <Text style={styles.dateLocation}>{exp.location}</Text>
                )}
                {exp.description?.trim() && <Text style={styles.description}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {validEducation.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Formação acadêmica</Text>
            {validEducation.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <Text style={styles.institutionName}>{edu.institution}</Text>
                {(edu.degree || edu.field || edu.startDate || edu.endDate) && (
                  <Text style={styles.degreeInfo}>
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}{(edu.startDate || edu.endDate) ? ` · (${formatDate(edu.startDate)} - ${formatDate(edu.endDate)})` : ''}
                  </Text>
                )}
                {edu.description?.trim() && (
                  <Text style={styles.description}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {validCourses.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Cursos e Treinamentos</Text>
            {validCourses.map((course) => (
              <View key={course.id} style={styles.courseItem}>
                <Text style={styles.courseName}>{course.name}</Text>
                {course.institution && <Text style={styles.courseInstitution}>{course.institution}</Text>}
                {(course.completionDate || course.duration) && (
                  <Text style={styles.courseInfo}>
                    {course.completionDate ? formatDate(course.completionDate) : ''}
                    {course.completionDate && course.duration ? ' • ' : ''}
                    {course.duration || ''}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
