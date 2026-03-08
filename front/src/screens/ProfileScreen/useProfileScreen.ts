/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { UserProfile, Experience, Education, Language } from './types';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';
import { formatMonthYear } from '../../utils/dateFormatter';
import { ProfileToResumeAdapter } from '../../infrastructure/adapters/ProfileToResumeAdapter';
import { clearProfileCache } from '../../components/ProtectedRoute/ProtectedRoute';
import { linkedinSupabase } from '../../infrastructure/supabase/linkedinClient';

export function useProfileScreen() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFirstAccess, setIsFirstAccess] = useState(location.state?.isFirstAccess || false);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [location_, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  
  const [about, setAbout] = useState('');
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const analysisData = location.state?.analysisData;
    if (analysisData && analysisData.resumoOtimizado) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      const updatedFields: string[] = [];
      
      setAbout(analysisData.resumoOtimizado);
      updatedFields.push('Resumo Profissional');
      
      if (analysisData.palavrasChave && analysisData.palavrasChave.length > 0) {
        const keywords = analysisData.palavrasChave;
        
        setExperiences(prevExperiences => {
          if (prevExperiences.length > 0) {
            updatedFields.push('Experiências');
            return prevExperiences.map((exp, index) => {
              if (exp.description) {
                const relevantKeywords = keywords.slice(index * 3, (index + 1) * 3);
                if (relevantKeywords.length > 0) {
                  const keywordsText = `\n\n${relevantKeywords.join(', ')}`;
                  return {
                    ...exp,
                    description: exp.description + keywordsText
                  };
                }
              }
              return exp;
            });
          }
          return prevExperiences;
        });
      }
      
      if (analysisData.sugestoesMelhoriaTexto) {
        const sugestoesTexto = analysisData.sugestoesMelhoriaTexto;
        const sugestoesLower = sugestoesTexto.toLowerCase();
        
        const tituloPatterns = [
          /título.*?:?\s*["']?([^"'\n.]{5,50})["']?/i,
          /posição.*?:?\s*["']?([^"'\n.]{5,50})["']?/i,
          /cargo.*?:?\s*["']?([^"'\n.]{5,50})["']?/i
        ];
        
        for (const pattern of tituloPatterns) {
          const match = sugestoesTexto.match(pattern);
          if (match && match[1] && !professionalTitle.trim()) {
            const titulo = match[1].trim();
            if (titulo.length > 5 && titulo.length < 50) {
              setProfessionalTitle(titulo);
              updatedFields.push('Título Profissional');
              break;
            }
          }
        }
        
        const certificacoesPattern = /certificaç(?:ão|ões)|curso|formação/i;
        if (certificacoesPattern.test(sugestoesTexto)) {
          setEducation(prevEducation => {
            if (prevEducation.length > 0) {
              updatedFields.push('Formação (sugestões adicionadas)');
              return prevEducation.map((edu, index) => {
                if (index === prevEducation.length - 1) {
                  return {
                    ...edu,
                    institution: edu.institution
                  };
                }
                return edu;
              });
            }
            return prevEducation;
          });
        }
        
        const idiomaPatterns = ['inglês', 'espanhol', 'francês', 'alemão', 'mandarim', 'japonês'];
        const idiomasMencionados = idiomaPatterns.filter(idioma => 
          sugestoesLower.includes(idioma)
        );
        
        if (idiomasMencionados.length > 0 && languages.length === 0) {
          const novosIdiomas: Language[] = idiomasMencionados.map((idioma, index) => ({
            id: `analysis-${Date.now()}-${index}`,
            language: idioma.charAt(0).toUpperCase() + idioma.slice(1),
            proficiency: 'intermediate' as const
          }));
          setLanguages(novosIdiomas);
          updatedFields.push('Idiomas');
        }
        
        const locationPatterns = [
          /localização.*?:?\s*["']?([^"'\n.]{3,40})["']?/i,
          /cidade.*?:?\s*["']?([^"'\n.]{3,40})["']?/i,
          /(?:em|de)\s+([A-Z][a-zà-ú]+(?:\s+[A-Z][a-zà-ú]+)?)\s*,?\s*([A-Z]{2})?/
        ];
        
        for (const pattern of locationPatterns) {
          const match = sugestoesTexto.match(pattern);
          if (match && match[1] && !location_.trim()) {
            const loc = match[1].trim();
            if (loc.length > 3 && loc.length < 40) {
              setLocation(loc);
              updatedFields.push('Localização');
              break;
            }
          }
        }
      }
      
      setIsEditing(true);
      
      setMessage({ 
        type: 'success', 
        text: t('profile.fieldsUpdatedMessage', { count: updatedFields.length, fields: updatedFields.join(', ') })
      });
      
      window.history.replaceState({}, document.title);
    }
  }, [languages.length, location.state, location_, professionalTitle]);

  useEffect(() => {
    let isMounted = true;

    const clearAllData = () => {
      if (isMounted) {
        setProfile(null);
        setDisplayName('');
        setProfessionalTitle('');
        setPhone('');
        setLocation('');
        setLinkedin('');
        setGithub('');
        setAbout('');
        setExperiences([]);
        setEducation([]);
        setLanguages([]);
        setLoading(false);
      }
    };

    if (!currentUser) {
      clearAllData();
      return;
    }

    const fetchProfile = async () => {
      try {
        if (!db) {
          if (isMounted) {
            setDisplayName(currentUser.displayName || '');
            setLoading(false);
          }
          return;
        }

        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (isMounted) {
          if (profileSnap.exists()) {
            const data = profileSnap.data();
            const profileData: UserProfile = {
              ...data,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
              profileCompleted: data.profileCompleted || false,
            } as UserProfile;
            
            setProfile(profileData);
            setDisplayName(profileData.displayName || '');
            setProfessionalTitle(profileData.professionalTitle || '');
            setPhone(profileData.phone || '');
            setLocation(profileData.location || '');
            setLinkedin(profileData.linkedin || '');
            setGithub(profileData.github || '');
            setAbout(profileData.about || '');
            setExperiences(profileData.experiences || []);
            setEducation(profileData.education || []);
            setLanguages(profileData.languages || []);
            
            if (profileData.profileCompleted) {
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          } else {
            setProfile(null);
            setDisplayName(currentUser.displayName || '');
            setProfessionalTitle('');
            setPhone('');
            setLocation('');
            setLinkedin('');
            setGithub('');
            setAbout('');
            setExperiences([]);
            setEducation([]);
            setLanguages([]);
            setIsEditing(true);
          }
        }
      } catch (error) {
        if (isMounted) {
          setProfile(null);
          setDisplayName(currentUser.displayName || '');
          setProfessionalTitle('');
          setPhone('');
          setLocation('');
          setLinkedin('');
          setGithub('');
          setAbout('');
          setExperiences([]);
          setEducation([]);
          setLanguages([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
      setProfile(null);
      setDisplayName('');
      setProfessionalTitle('');
      setPhone('');
      setLocation('');
      setLinkedin('');
      setGithub('');
      setAbout('');
      setExperiences([]);
      setEducation([]);
      setLanguages([]);
    };
  }, [currentUser]);

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    };
    setExperiences([...experiences, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    if ((field === 'startDate' || field === 'endDate') && typeof value === 'string') {
      value = formatMonthYear(value);
    }
    
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
    };
    setEducation([...education, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    if ((field === 'startDate' || field === 'endDate') && typeof value === 'string') {
      value = formatMonthYear(value);
    }
    
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      language: '',
      proficiency: 'basic',
    };
    setLanguages([...languages, newLanguage]);
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const validateForm = (): boolean => {
    if (isFirstAccess) {
      if (!displayName.trim()) {
        setMessage({ type: 'error', text: t('profile.fullNameRequired') });
        return false;
      }
      
      if (!about.trim()) {
        setMessage({ type: 'error', text: t('profile.summaryRequired') });
        return false;
      }

      const hasValidExperience = experiences.length > 0 && experiences.some(exp => 
        exp.company.trim() && exp.position.trim() && exp.startDate.trim()
      );
      
      if (!hasValidExperience) {
        setMessage({ type: 'error', text: t('profile.experienceRequired') });
        return false;
      }

      const hasValidEducation = education.length > 0 && education.some(edu => 
        edu.institution.trim()
      );
      
      if (!hasValidEducation) {
        setMessage({ type: 'error', text: t('profile.educationRequired') });
        return false;
      }

    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setMessage({ type: 'error', text: t('profile.userNotAuthenticated') });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const profileData: Record<string, any> = {
        uid: currentUser.uid,
        displayName: displayName.trim() || currentUser.displayName || '',
        email: currentUser.email!,
        professionalTitle: professionalTitle.trim(),
        phone: phone.trim(),
        location: location_.trim(),
        linkedin: linkedin.trim(),
        github: github.trim(),
        about: about.trim(),
        experiences: experiences.filter(exp => exp.company.trim() || exp.position.trim()),
        education: education.filter(edu => edu.institution.trim()),
        languages: languages.filter(lang => lang.language.trim()),
        profileCompleted: true,
        updatedAt: Timestamp.now(),
      };

      if (currentUser.photoURL) {
        profileData.photoURL = currentUser.photoURL;
      }

      if (!db) {
        throw new Error('Firestore não está configurado');
      }

      const profileRef = doc(db, 'profiles', currentUser.uid);
      await setDoc(profileRef, profileData, { merge: true });

      const updatedProfile: UserProfile = {
        uid: profileData.uid,
        displayName: profileData.displayName,
        email: profileData.email,
        photoURL: profileData.photoURL,
        professionalTitle: profileData.professionalTitle,
        phone: profileData.phone,
        location: profileData.location,
        linkedin: profileData.linkedin,
        github: profileData.github,
        about: profileData.about,
        experiences: profileData.experiences,
        education: profileData.education,
        languages: profileData.languages,
        profileCompleted: true,
        updatedAt: new Date(),
      };

      setProfile(updatedProfile);
      
      clearProfileCache();
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      const wasUpdatedFromAnalysis = location.state?.analysisData;
      
      if (isFirstAccess) {
        setIsFirstAccess(false);
        setMessage({ type: 'success', text: t('profile.profileCreated') });
        setTimeout(() => {
          navigate(ROUTES.VAGAS_RECOMENDADAS, { replace: true });
        }, 2000);
      } else {
        setIsEditing(false);

        if (wasUpdatedFromAnalysis) {
          setMessage({
            type: 'success',
            text: t('profile.profileUpdated') + ' ' + t('profile.reloadFromUpdatedProfile')
          });
        } else {
          setMessage({ type: 'success', text: t('profile.profileUpdated') });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const errorCode = error && typeof error === 'object' && 'code' in error ? (error as any).code : '';
      
      if (errorCode === 'permission-denied' || errorMessage.includes('Missing or insufficient permissions')) {
        
        setMessage({ 
          type: 'error', 
          text: t('profile.firestorePermissionError')
        });
      } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
        setMessage({ type: 'error', text: t('profile.connectionError') });
      } else {
        setMessage({ type: 'error', text: t('profile.saveError', { error: errorMessage }) });
      }
    } finally {
      setSaving(false);
    }
  };

  const dismissMessage = () => {
    setMessage(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!profile?.profileCompleted) {
      return;
    }
    
    if (profile) {
      setDisplayName(profile.displayName || '');
      setProfessionalTitle(profile.professionalTitle || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setLinkedin(profile.linkedin || '');
      setGithub(profile.github || '');
      setAbout(profile.about || '');
      setExperiences(profile.experiences || []);
      setEducation(profile.education || []);
      setLanguages(profile.languages || []);
    }
    
    setIsEditing(false);
    setMessage(null);
  };

  const handleDownloadResume = () => {
    if (!profile) return;

    const resumeText = formatResumeText(profile);
    
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `curriculo_${displayName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setMessage({ type: 'success', text: t('profile.resumeDownloaded') });
  };

  const formatResumeText = (profileData: UserProfile): string => {
    let text = '';
    
    text += `${profileData.displayName}\n`;
    if (profileData.professionalTitle) text += `${profileData.professionalTitle}\n`;
    text += `\n`;
    
    if (currentUser?.email) text += `Email: ${currentUser.email}\n`;
    if (profileData.phone) text += `Telefone: ${profileData.phone}\n`;
    if (profileData.location) text += `Localização: ${profileData.location}\n`;
    if (profileData.linkedin) text += `LinkedIn: ${profileData.linkedin}\n`;
    if (profileData.github) text += `GitHub: ${profileData.github}\n`;
    text += `\n`;
    
    if (profileData.about) {
      text += `RESUMO PROFISSIONAL\n`;
      text += `${'='.repeat(50)}\n`;
      text += `${profileData.about}\n\n`;
    }
    
    if (profileData.experiences && profileData.experiences.length > 0) {
      text += `EXPERIÊNCIA PROFISSIONAL\n`;
      text += `${'='.repeat(50)}\n`;
      profileData.experiences.forEach((exp) => {
        text += `\n${exp.position} - ${exp.company}\n`;
        if (exp.location) text += `${exp.location}\n`;
        const endDate = exp.isCurrent ? 'Atual' : exp.endDate;
        text += `${exp.startDate} - ${endDate}\n`;
        if (exp.description) text += `\n${exp.description}\n`;
        text += `\n`;
      });
    }
    
    if (profileData.education && profileData.education.length > 0) {
      text += `FORMAÇÃO ACADÊMICA\n`;
      text += `${'='.repeat(50)}\n`;
      profileData.education.forEach((edu) => {
        text += `\n${edu.degree} - ${edu.fieldOfStudy}\n`;
        text += `${edu.institution}\n`;
        text += `${edu.startDate} - ${edu.endDate}\n\n`;
      });
    }
    
    if (profileData.languages && profileData.languages.length > 0) {
      text += `IDIOMAS\n`;
      text += `${'='.repeat(50)}\n`;
      profileData.languages.forEach((lang) => {
        text += `${lang.language}: ${lang.proficiency}\n`;
      });
    }
    
    return text;
  };

  const handleSubmitResumeData = async (resumeData: any) => {
    if (!currentUser || !db) return;

    setSaving(true);
    setMessage(null);

    try {
      const convertedProfile = ProfileToResumeAdapter.convertBack(resumeData);
      
      const profileData: UserProfile = {
        uid: currentUser.uid,
        displayName: convertedProfile.displayName || '',
        email: currentUser.email || '',
        professionalTitle: convertedProfile.professionalTitle || '',
        phone: convertedProfile.phone || '',
        location: convertedProfile.location || '',
        linkedin: convertedProfile.linkedin || '',
        github: convertedProfile.github || '',
        about: convertedProfile.about || '',
        experiences: convertedProfile.experiences || [],
        education: convertedProfile.education || [],
        languages: convertedProfile.languages || [],
        skills: convertedProfile.skills || [],
        certifications: convertedProfile.certifications || [],
        courses: convertedProfile.courses || [],
        profileCompleted: true,
        updatedAt: new Date(),
      };

      const profileRef = doc(db, 'profiles', currentUser.uid);
      await setDoc(profileRef, profileData);

      setProfile(profileData);
      setIsEditing(false);
      
      clearProfileCache();
      
      if (isFirstAccess) {
        setIsFirstAccess(false);
        setMessage({ type: 'success', text: t('profile.profileCreated') });
        setTimeout(() => {
          navigate(ROUTES.VAGAS_RECOMENDADAS, { replace: true });
        }, 2000);
      } else {
        setMessage({ type: 'success', text: t('profile.resumeSaved') });

        if (location.state?.fromProfile) {
          setTimeout(() => {
            navigate(ROUTES.VAGAS_RECOMENDADAS, {
              state: { fromProfile: true },
              replace: true
            });
          }, 500);
        }
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao salvar currículo',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImportFromLinkedIn = async (linkedinUrl: string) => {
    if (!linkedinUrl.trim()) {
      setMessage({ type: 'error', text: t('profile.linkedinImportError') });
      return;
    }

    const urlPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;
    if (!urlPattern.test(linkedinUrl.trim())) {
      setMessage({ type: 'error', text: t('profile.linkedinImportError') });
      return;
    }

    setIsImporting(true);
    setMessage(null);

    try {
      const { data, error } = await linkedinSupabase.functions.invoke('fetch-linkedin-profile', {
        body: { linkedinUrl: linkedinUrl.trim() }
      });

      if (error || !data) {
        throw new Error(error?.message || 'Erro ao buscar perfil do LinkedIn');
      }

      // Helper para converter "Mês Ano" para "MM/YYYY" 
      const convertToMMYYYY = (dateStr: string): string => {
        if (!dateStr) return '';
        
        // Mapa de meses em português para números
        const monthToNumber: Record<string, string> = {
          'Jan': '01', 'Fev': '02', 'Mar': '03', 'Abr': '04',
          'Mai': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08',
          'Set': '09', 'Out': '10', 'Nov': '11', 'Dez': '12',
        };
        
        // Tentar extrair "Mês YYYY" (ex: "Jul 2022")
        const match = dateStr.match(/^(\w{3})\s+(\d{4})$/);
        if (match) {
          const [, month, year] = match;
          const monthNum = monthToNumber[month] || '01';
          return `${monthNum}/${year}`;
        }
        
        // Se já está no formato MM/YYYY, retornar como está
        if (/^\d{2}\/\d{4}$/.test(dateStr)) {
          return dateStr;
        }
        
        // Se é só o ano, retornar 01/ANO
        if (/^\d{4}$/.test(dateStr)) {
          return `01/${dateStr}`;
        }
        
        return dateStr;
      };

      // Helper para formatar datas do LinkedIn usando month e year separados
      const formatLinkedInDate = (month: number | string, year: number | string): string => {
        if (!year) return '';
        if (!month) return `${year}`;
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        // Se month for número
        if (typeof month === 'number') {
          const monthIndex = month - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            return `${monthNames[monthIndex]} ${year}`;
          }
        }
        
        // Se month for string (como "May", "Jan", etc.), mapear para português
        if (typeof month === 'string') {
          const monthMap: Record<string, string> = {
            'Jan': 'Jan', 'Feb': 'Fev', 'Mar': 'Mar', 'Apr': 'Abr',
            'May': 'Mai', 'Jun': 'Jun', 'Jul': 'Jul', 'Aug': 'Ago',
            'Sep': 'Set', 'Oct': 'Out', 'Nov': 'Nov', 'Dec': 'Dez',
            'January': 'Jan', 'February': 'Fev', 'March': 'Mar', 'April': 'Abr',
            'June': 'Jun', 'July': 'Jul', 'August': 'Ago',
            'September': 'Set', 'October': 'Out', 'November': 'Nov', 'December': 'Dez',
          };
          
          const mappedMonth = monthMap[month] || month;
          return `${mappedMonth} ${year}`;
        }
        
        return `${year}`;
      };

      // Preencher dados básicos do LinkedIn no perfil
      const importedName = data.full_name || '';
      const importedTitle = data.headline || data.occupation || '';
      const importedAbout = data.summary || '';
      const importedLocation = data.location || ''; // Location vem no nível principal
      const importedPhotoURL = data.profile_pic_url || ''; // Foto do perfil
      
      setDisplayName(importedName);
      setProfessionalTitle(importedTitle);
      setLinkedin(linkedinUrl.trim());
      setAbout(importedAbout);
      setLocation(importedLocation);

      // Se houver foto do LinkedIn, salvar no perfil
      if (importedPhotoURL && currentUser && db) {
        try {
          const profileRef = doc(db, 'profiles', currentUser.uid);
          
          // Buscar o profile atual para preservar outros dados
          const currentProfileSnap = await getDoc(profileRef);
          const currentProfileData = currentProfileSnap.exists() ? currentProfileSnap.data() : {};
          
          // Salvar a foto no perfil
          await setDoc(profileRef, {
            ...currentProfileData,
            photoURL: importedPhotoURL,
            updatedAt: Timestamp.now(),
          }, { merge: true });
          
          console.log('Foto do LinkedIn importada com sucesso:', importedPhotoURL);
          
          // Recarregar o profile do Firestore para garantir que a foto está atualizada
          const updatedProfileSnap = await getDoc(profileRef);
          if (updatedProfileSnap.exists()) {
            const updatedData = updatedProfileSnap.data();
            const updatedProfile: UserProfile = {
              ...updatedData,
              updatedAt: updatedData.updatedAt?.toDate ? updatedData.updatedAt.toDate() : new Date(),
              profileCompleted: updatedData.profileCompleted || false,
            } as UserProfile;
            setProfile(updatedProfile);
          }
        } catch (photoError) {
          console.error('Erro ao salvar foto do LinkedIn:', photoError);
          // Não bloquear a importação se houver erro ao salvar a foto
        }
      }

      // Preencher experiências com TODOS os dados estruturados
      const linkedinExperiences: Experience[] = [];
      if (data.experiences && data.experiences.length > 0) {
        data.experiences.forEach((exp: any, index: number) => {
          // Garantir que start_month e end_month são tratados corretamente
          const startMonth = exp.start_month || null;
          const startYear = exp.start_year || null;
          const endMonth = (exp.end_month && exp.end_month !== "") ? exp.end_month : null;
          const endYear = (exp.end_year && exp.end_year !== "") ? exp.end_year : null;
          
          const startDate = startMonth && startYear ? formatLinkedInDate(startMonth, startYear) : '';
          const endDate = endMonth && endYear ? formatLinkedInDate(endMonth, endYear) : '';
          const isCurrent = exp.is_current || false;
          
          // Converter para o formato MM/YYYY esperado pelos inputs
          const startDateFormatted = convertToMMYYYY(startDate);
          const endDateFormatted = convertToMMYYYY(endDate);
          
          linkedinExperiences.push({
            id: `linkedin-${Date.now()}-${index}`,
            company: exp.company || '',
            position: exp.title || '',
            location: exp.location || '',
            startDate: startDateFormatted,
            endDate: endDateFormatted,
            isCurrent: isCurrent,
            description: exp.description || '',
          });
        });
        // NÃO chamar setExperiences aqui - será feito pelo useEffect quando setProfile for chamado
      }

      // Preencher educação com TODOS os dados estruturados
      const linkedinEducation: Education[] = [];
      if (data.educations && data.educations.length > 0) {
        data.educations.forEach((edu: any, index: number) => {
          // Garantir que os campos são tratados corretamente
          const startMonth = edu.start_month || null;
          const startYear = edu.start_year || null;
          const endMonth = edu.end_month || null;
          const endYear = edu.end_year || null;
          
          const startDate = startMonth && startYear ? formatLinkedInDate(startMonth, startYear) : '';
          const endDate = endMonth && endYear ? formatLinkedInDate(endMonth, endYear) : '';
          
          // Converter para o formato MM/YYYY esperado pelos inputs
          const startDateFormatted = convertToMMYYYY(startDate);
          const endDateFormatted = convertToMMYYYY(endDate);
          
          linkedinEducation.push({
            id: `linkedin-${Date.now()}-${index}`,
            institution: edu.school || '',
            degree: edu.degree || '',
            fieldOfStudy: edu.field_of_study || '',
            startDate: startDateFormatted || '',
            endDate: endDateFormatted || '',
            description: edu.activities || '',
          });
        });
        // NÃO chamar setEducation aqui - será feito pelo useEffect quando setProfile for chamado
      }

      // Preencher idiomas
      const linkedinLanguages: Language[] = [];
      if (data.languages && Array.isArray(data.languages) && data.languages.length > 0) {
        data.languages.forEach((lang: any, index: number) => {
          const languageName = typeof lang === 'string' ? lang : (lang.name || lang.language || '');
          let proficiency: 'basic' | 'intermediate' | 'professional' | 'native' = 'intermediate';
          
          if (lang.proficiency) {
            const profLower = lang.proficiency.toLowerCase();
            if (profLower.includes('native') || profLower.includes('nativo')) {
              proficiency = 'native';
            } else if (profLower.includes('professional') || profLower.includes('profissional') || profLower.includes('fluent')) {
              proficiency = 'professional';
            } else if (profLower.includes('basic') || profLower.includes('básico') || profLower.includes('elementary')) {
              proficiency = 'basic';
            }
          }
          
          if (languageName) {
            linkedinLanguages.push({
              id: `linkedin-${Date.now()}-${index}`,
              language: languageName,
              proficiency: proficiency,
            });
          }
        });
        setLanguages(linkedinLanguages);
      }

      // Preencher skills - a API retorna como string separada por |
      const linkedinSkills: string[] = [];
      
      if (data.skills && typeof data.skills === 'string') {
        // Skills vem como "Jest|SwiftUI|Amazon Web Services (AWS)|TypeScript|..."
        const skillsArray = data.skills
          .split('|')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0 && s.length < 100); // Filtrar strings muito longas
        
        linkedinSkills.push(...skillsArray);
      } else if (Array.isArray(data.skills)) {
        // Caso venha como array
        data.skills.forEach((skill: any) => {
          const skillName = typeof skill === 'string' ? skill : skill.name;
          if (skillName) {
            linkedinSkills.push(skillName);
          }
        });
      }
      
      // Se ainda não houver skills, tentar extrair do summary como fallback
      if (linkedinSkills.length === 0 && data.summary) {
        const techSectionPattern = /(?:Technologies?|Skills?|Tech Stack):\s*\n?➤?\s*(.+?)(?:\n\n|$)/is;
        const match = data.summary.match(techSectionPattern);
        
        if (match && match[1]) {
          const skillsText = match[1];
          const extractedSkills = skillsText
            .split(/[|,•]/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0 && s.length < 50);
          
          linkedinSkills.push(...extractedSkills);
        }
      }

      // Preencher certificações
      const linkedinCertifications: string[] = [];
      if (data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0) {
        data.certifications.forEach((cert: any) => {
          const certName = cert.name || cert.title || '';
          const authority = cert.authority || '';
          const issued = cert.issued || '';
          
          // Formato: "Nome - Authority (Issued: Data)"
          let fullCertName = certName;
          if (authority) {
            fullCertName = `${certName} - ${authority}`;
          }
          if (issued) {
            fullCertName = `${fullCertName} (${issued})`;
          }
          
          if (fullCertName) {
            linkedinCertifications.push(fullCertName);
          }
        });
      }

      // Preencher cursos
      const linkedinCourses: any[] = [];
      if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
        data.courses.forEach((course: any, index: number) => {
          if (course.name) {
            linkedinCourses.push({
              id: `linkedin-${Date.now()}-${index}`,
              name: course.name,
              institution: course.number || course.institution || '',
              completionDate: course.completionDate || '',
              duration: course.duration || '',
            });
          }
        });
      }

      // Criar um profile temporário com os dados importados
      const importedProfile: UserProfile = {
        uid: currentUser?.uid || '',
        displayName: importedName,
        email: currentUser?.email || '',
        photoURL: importedPhotoURL || currentUser?.photoURL || undefined,
        professionalTitle: importedTitle,
        phone: '',
        location: importedLocation, // Location vem da API
        linkedin: linkedinUrl.trim(),
        github: '',
        about: importedAbout,
        experiences: linkedinExperiences,
        education: linkedinEducation,
        languages: linkedinLanguages,
        skills: linkedinSkills,
        certifications: linkedinCertifications,
        courses: linkedinCourses,
        profileCompleted: false,
        updatedAt: new Date(),
      };
      
      // Atualizar o profile state para que o ResumeEditor pegue os dados
      setProfile(importedProfile);

      // Extrair o primeiro nome para personalizar a mensagem
      const firstName = importedName.split(' ')[0] || 'Usuário';
      setMessage({ 
        type: 'success', 
        text: t('profile.linkedinImportSuccess', { name: firstName })
      });
      setIsEditing(true);
    } catch (error: any) {
      console.error('Erro ao importar do LinkedIn:', error);
      setMessage({ 
        type: 'error', 
        text: t('profile.linkedinImportError')
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    currentUser,
    profile,
    loading,
    saving,
    message,
    isFirstAccess,
    isImporting,
    
    displayName,
    setDisplayName,
    professionalTitle,
    setProfessionalTitle,
    phone,
    setPhone,
    location: location_,
    setLocation,
    linkedin,
    setLinkedin,
    github,
    setGithub,
    
    about,
    setAbout,
    
    experiences,
    addExperience,
    updateExperience,
    removeExperience,
    
    education,
    addEducation,
    updateEducation,
    removeEducation,
    
    languages,
    addLanguage,
    updateLanguage,
    removeLanguage,
    
    handleSubmit,
    handleSubmitResumeData,
    handleImportFromLinkedIn,
    dismissMessage,
    
    isEditing,
    handleEdit,
    handleCancelEdit,
    handleDownloadResume,
  };
}
