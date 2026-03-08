import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

import { JobListings } from '../../components/Jobs';
import { HeroSection } from './components/HeroSection';
import { useAuth } from '../../contexts/AuthContext';
import { type LocationSelection, formatLocationLabel } from '../../data/locations';

import * as S from './styles';

interface UserProfile {
  professionalTitle?: string;
  about?: string;
  skills?: string[];
  location?: string;
  experiences?: Array<{
    position?: string;
    company?: string;
  }>;
}

export const RecommendedJobsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<{
    headline?: string;
    occupation?: string;
    skills?: string[];
    location?: string;
  }>({});
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isPCD, setIsPCD] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!currentUser?.uid || !db) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        const isUserPCD = userSnap.exists() && userSnap.data()?.isPCD === true;
        setIsPCD(isUserPCD);

        if (profileSnap.exists()) {
          const data = profileSnap.data() as UserProfile;

          let skills: string[] = [];
          if (data.skills && Array.isArray(data.skills)) {
            skills = data.skills.slice(0, 5);
          }

          let headline = data.professionalTitle || '';
          if (!headline && data.experiences && data.experiences.length > 0) {
            const latestExp = data.experiences[0];
            headline = latestExp.position || '';
          }

          let occupation = data.professionalTitle || '';
          if (!occupation && data.about) {
            occupation = data.about.split(' ').slice(0, 3).join(' ');
          }

          setUserProfile({
            headline,
            occupation,
            skills,
            location: data.location,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [currentUser]);

  const handleLocationChange = useCallback((selection: LocationSelection) => {
    const label = formatLocationLabel(selection);
    setUserProfile((prev) => ({ ...prev, location: label }));
  }, []);

  return (
    <>
      <S.Wrapper>
        <S.PageHeader>
          <S.PageTitle>{t('recommendedJobs.title')}</S.PageTitle>
          <S.PageSubtitle>{t('recommendedJobs.hero.subtitle')}</S.PageSubtitle>
        </S.PageHeader>

        <S.ContentWrapper>
          <S.DashboardGrid>
            <HeroSection />

            {!isLoadingProfile && (
              <JobListings
                headline={userProfile.headline}
                occupation={userProfile.occupation}
                skills={userProfile.skills}
                location={userProfile.location}
                isPCD={isPCD}
                onLocationChange={handleLocationChange}
              />
            )}
          </S.DashboardGrid>
        </S.ContentWrapper>
      </S.Wrapper>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};
