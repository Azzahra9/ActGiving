import React from 'react';
import { ResetPasswordModal, ResetPasswordModalProps } from './ResetPasswordModal';

export const ResetPassword: React.FC<ResetPasswordModalProps> = (props) => {
  return <ResetPasswordModal {...props} />;
};

export default ResetPassword;
