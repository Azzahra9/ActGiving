import React from 'react';
import { AuthModal } from './AuthModal';
import { UserProfile } from '../types';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  onSelectUser?: (user: UserProfile) => void;
  onOpenForgotPassword?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onOpenForgotPassword,
}) => {
  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      currentUser={currentUser}
      onSelectUser={onSelectUser}
      initialTab="login"
      onOpenForgotPassword={onOpenForgotPassword}
    />
  );
};

export default LoginModal;
