import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { getCsrfCookie, getAuthToken, setAuthToken, removeAuthToken } from '../lib/axios';
import { UserProfile, UserRole, DEFAULT_GUEST_USER } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
  rolePreference?: 'relawan' | 'inisiator';
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  phone_whatsapp?: string;
  city_domicile?: string;
  rolePreference?: 'relawan' | 'inisiator';
}

export interface AuthContextType {
  user: UserProfile;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<UserProfile>;
  register: (payload: RegisterPayload) => Promise<UserProfile>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile) => void;
  switchDemoPersona: (roleKey: UserRole) => void;
  refreshUser: () => Promise<void>;
}

// Helper untuk mentransformasikan objek user dari Laravel ke UserProfile frontend
export const mapBackendUserToProfile = (
  backendUser: any,
  rolePreference?: 'relawan' | 'inisiator'
): UserProfile => {
  const storedPreference = (typeof window !== 'undefined'
    ? localStorage.getItem('actgiving_preferred_role')
    : null) as 'relawan' | 'inisiator' | null;

  let assignedRole: UserRole = 'guest';
  if (backendUser.role === 'admin') {
    assignedRole = 'admin';
  } else {
    assignedRole = rolePreference || storedPreference || 'inisiator';
  }

  return {
    id: String(backendUser.id),
    name: backendUser.name || 'Pengguna ActGiving',
    email: backendUser.email || '',
    role: assignedRole,
    phone: backendUser.phone_whatsapp || '',
    city: backendUser.city_domicile || 'Bandung',
    avatarUrl:
      backendUser.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        backendUser.name || 'User'
      )}&background=0284c7&color=fff&bold=true`,
    joinedCampaignIds: [],
    managedCampaignIds: [],
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_GUEST_USER);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!token && user.role !== 'guest';

  // Sinkronisasi data user saat mount jika token sudah tersimpan
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.data) {
          const profile = mapBackendUserToProfile(response.data.data);
          setUser(profile);
          setTokenState(storedToken);
        }
      } catch (error) {
        console.warn('Sesi login telah kedaluwarsa atau token tidak valid.');
        removeAuthToken();
        setTokenState(null);
        setUser(DEFAULT_GUEST_USER);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fungsi Login
  const login = async (credentials: LoginCredentials): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      // 1. Ambil CSRF Cookie dari Laravel Sanctum
      try {
        await getCsrfCookie();
      } catch (csrfErr) {
        console.warn('Warning: Gagal memuat CSRF cookie, melanjutkan request login...', csrfErr);
      }

      // 2. Request POST ke /api/auth/login
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const responseData = response.data;
      if (!responseData.success && !responseData.data?.token) {
        throw new Error(responseData.message || 'Login gagal.');
      }

      const receivedToken = responseData.data.token;
      const backendUser = responseData.data.user;

      // 3. Simpan preferensi role jika ada
      if (credentials.rolePreference) {
        localStorage.setItem('actgiving_preferred_role', credentials.rolePreference);
      }

      // 4. Simpan token ke storage & header axios
      setAuthToken(receivedToken);
      setTokenState(receivedToken);

      // 5. Update state user global
      const profile = mapBackendUserToProfile(backendUser, credentials.rolePreference);
      setUser(profile);

      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Registrasi Baru
  const register = async (payload: RegisterPayload): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      // 1. Ambil CSRF Cookie dari Laravel Sanctum
      try {
        await getCsrfCookie();
      } catch (csrfErr) {
        console.warn('Warning: Gagal memuat CSRF cookie, melanjutkan request register...', csrfErr);
      }

      // 2. Request POST ke /api/auth/register
      const response = await api.post('/auth/register', {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.password_confirmation || payload.password,
        phone_whatsapp: payload.phone_whatsapp || null,
        city_domicile: payload.city_domicile || null,
      });

      const responseData = response.data;
      if (!responseData.success && !responseData.data?.token) {
        throw new Error(responseData.message || 'Registrasi gagal.');
      }

      const receivedToken = responseData.data.token;
      const backendUser = responseData.data.user;

      if (payload.rolePreference) {
        localStorage.setItem('actgiving_preferred_role', payload.rolePreference);
      }

      setAuthToken(receivedToken);
      setTokenState(receivedToken);

      const profile = mapBackendUserToProfile(backendUser, payload.rolePreference);
      setUser(profile);

      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Logout
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (token) {
        await api.post('/auth/logout').catch((err) => {
          console.warn('API logout error (mengabaikan untuk membersihkan state lokal):', err);
        });
      }
    } finally {
      removeAuthToken();
      localStorage.removeItem('actgiving_preferred_role');
      setTokenState(null);
      setUser(DEFAULT_GUEST_USER);
      setIsLoading(false);
    }
  };

  // Demo Persona Switcher (Tetap mendukung fitur demo cepat UI)
  const switchDemoPersona = (roleKey: UserRole) => {
    if (roleKey === 'guest') {
      removeAuthToken();
      setTokenState(null);
      setUser(DEFAULT_GUEST_USER);
    }
  };

  const refreshUser = async (): Promise<void> => {
    const currentToken = getAuthToken();
    if (!currentToken) return;
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.data) {
        setUser(mapBackendUserToProfile(response.data.data));
      }
    } catch (err) {
      console.warn('Gagal memuat ulang data user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        setUser,
        switchDemoPersona,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
