import { getUserType } from '../utils/auth';

export const useAuth = () => {
  return {
    userType: getUserType(),
    user: JSON.parse(sessionStorage.getItem('user')),
    hasAccess: (allowedRoles) => allowedRoles.includes(getUserType()),
  };
};