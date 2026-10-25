import React from 'react';
import { AuthModal } from './AuthModal';
import { UserProfile } from '../types';

export interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  onSelectUser?: (user: UserProfile) => void;
  initialTab?: 'login' | 'register';
  initialRole?: 'relawan' | 'inisiator';
}

/**
 * RegisterModal Component
 * Modal Registrasi Akun Umum / Dual-Role dengan tab 'Masuk Akun' & 'Daftar Baru (Dual-Role)'
 * serta opsi 'Fokus Jadi Relawan' dan 'Fokus Buka Kampanye'.
 */
export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  initialTab = 'register',
  initialRole = 'relawan',
}) => {
  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      currentUser={currentUser}
      onSelectUser={onSelectUser}
      initialTab={initialTab}
      initialRole={initialRole}
    />
  );
};
