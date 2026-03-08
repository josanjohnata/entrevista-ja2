import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export const UserRole = {
  RECRUITER: 'recruiter',
  BASIC_PLAN: 'basic_plan',
  MONTHLY_PLAN: 'monthly_plan',
  QUARTERLY_PLAN: 'quarterly_plan'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'canceled';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  subscriptionStatus?: SubscriptionStatus;
  planExpirationDate?: Date;
  lastPaymentAt?: Date;
  region?: 'BR' | 'EU' | 'OTHER';
  currency?: 'BRL' | 'EUR' | 'USD';
  country?: string; // Código ISO do país (ex: 'BR', 'US', 'PT', 'FR')
  referralCode?: string; // Código único de indicação do usuário
  referredBy?: string; // Código de indicação que o usuário usou ao se cadastrar
  balance?: number; // Saldo de crédito do usuário (em centavos)
  pixKey?: string; // Chave PIX para recebimento de pagamentos (apenas BR)
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole, planExpirationDate?: Date) => Promise<void>;
  hasPermission: (requiredRole: UserRole) => boolean;
  refreshUserData: () => Promise<void>;
  hasActiveSubscription: boolean;
  isSubscriptionExpired: boolean;
  isAuthenticated: boolean;
  firebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const isFirebaseConfigured = () => {
  try {
    return true;
  } catch (error) {
    console.warn('Firebase não está disponível:', error);
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseConfigured] = useState(isFirebaseConfigured());

  const login = async (email: string, password: string) => {
    if (!firebaseConfigured) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente para usar autenticação.');
    }
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = await fetchUserData(result.user);
      setUserData(userData);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    if (!firebaseConfigured) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente para usar autenticação.');
    }
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      
      let userData = await fetchUserData(result.user);
      
      if (!userData) {
        await saveUserData(result.user, UserRole.BASIC_PLAN);
        userData = await fetchUserData(result.user);
      }
      
      setUserData(userData);
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string, role: UserRole) => {
    if (!firebaseConfigured) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente para usar autenticação.');
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(result.user, { displayName });
      
      await saveUserData(result.user, role);
      
      const userData = await fetchUserData(result.user);
      setUserData(userData);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!firebaseConfigured) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente para usar autenticação.');
    }
    
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  const updateUserRole = async (role: UserRole, planExpirationDate?: Date) => {
    if (!firebaseConfigured) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente para usar autenticação.');
    }
    if (!currentUser) {
      throw new Error('Usuário não está logado');
    }

    try {
      await saveUserData(currentUser, role, planExpirationDate);
      const updatedUserData = await fetchUserData(currentUser);
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Erro ao atualizar role do usuário:', error);
      throw error;
    }
  };

  const fetchUserData = useCallback(async (user: User): Promise<UserData | null> => {
    if (!firebaseConfigured) return null;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const subscriptionStatus = (data.subscriptionStatus || 'pending') as SubscriptionStatus;
        
        // Se o role não estiver definido mas o subscriptionStatus for 'active', inferir o role
        let role = data.role as UserRole | undefined;
        if (!role && subscriptionStatus === 'active') {
          // Tentar inferir do planId se disponível
          const planId = data.planId as string | undefined;
          if (planId) {
            if (planId.includes('quarterly') || planId === 'plan_quarterly') {
              role = UserRole.QUARTERLY_PLAN;
            } else if (planId.includes('monthly') || planId === 'plan_monthly') {
              role = UserRole.MONTHLY_PLAN;
            } else if (planId.includes('basic') || planId === 'plan_basic') {
              role = UserRole.BASIC_PLAN;
            }
          }
          // Se ainda não tiver role, usar basic_plan como padrão para usuários ativos
          if (!role) {
            role = UserRole.BASIC_PLAN;
          }
        }
        
        return {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || undefined,
          role: role || (data.role as UserRole),
          subscriptionStatus,
          planExpirationDate: data.planExpirationDate ? data.planExpirationDate.toDate() : undefined,
          lastPaymentAt: data.lastPaymentAt ? data.lastPaymentAt.toDate() : undefined,
          region: data.region as 'BR' | 'EU' | 'OTHER' | undefined,
          currency: data.currency as 'BRL' | 'EUR' | 'USD' | undefined,
          country: data.country as string | undefined,
          referralCode: data.referralCode as string | undefined,
          referredBy: data.referredBy as string | undefined,
          balance: data.balance as number | undefined,
          pixKey: data.pixKey as string | undefined,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }, [firebaseConfigured]);

  const saveUserData = async (user: User, role: UserRole, planExpirationDate?: Date) => {
    if (!firebaseConfigured) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userData: Partial<UserData> = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || undefined,
        role,
        planExpirationDate,
        updatedAt: new Date(),
      };

      const existingDoc = await getDoc(userDocRef);
      const isNewUser = !existingDoc.exists();
      
      if (isNewUser) {
        userData.createdAt = new Date();
      }

      await setDoc(userDocRef, userData, { merge: true });
      
      if (isNewUser) {
        const statsRef = doc(db, 'stats', 'users');
        await setDoc(statsRef, { count: increment(1), updatedAt: new Date() }, { merge: true });
      }
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      throw error;
    }
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!userData) return false;

    if (userData.planExpirationDate && userData.planExpirationDate < new Date()) {
      return false;
    }

    const roleHierarchy = {
      [UserRole.RECRUITER]: 4,
      [UserRole.QUARTERLY_PLAN]: 3,
      [UserRole.MONTHLY_PLAN]: 2,
      [UserRole.BASIC_PLAN]: 1,
    };

    return roleHierarchy[userData.role] >= roleHierarchy[requiredRole];
  };

  const refreshUserData = useCallback(async () => {
    if (!currentUser) return;
    
    const updatedData = await fetchUserData(currentUser);
    if (updatedData) {
      setUserData(updatedData);
    }
  }, [currentUser, fetchUserData]);

  useEffect(() => {
    if (!firebaseConfigured) {
      console.warn('Firebase não está configurado. Funcionalidades de autenticação não estão disponíveis.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      
      try {
        if (user) {
          setCurrentUser(user);
          const userData = await fetchUserData(user);
          setUserData(userData);
        } else {
          setCurrentUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.warn('Erro ao processar dados do usuário:', error);
      }
      setLoading(false);
    });
    
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [fetchUserData, firebaseConfigured]);

  const hasActiveSubscription = userData?.subscriptionStatus === 'active';
  
  const isSubscriptionExpired = 
    userData?.subscriptionStatus === 'expired' || 
    (userData?.planExpirationDate && userData.planExpirationDate < new Date());

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUserRole,
    hasPermission,
    refreshUserData,
    hasActiveSubscription,
    isSubscriptionExpired: !!isSubscriptionExpired,
    isAuthenticated: !!currentUser,
    firebaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
