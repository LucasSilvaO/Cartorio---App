export const isAuthenticated = () => {
    return !!sessionStorage.getItem('token'); // Retorna true se o token existir
  };
  
  export const getUserType = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return user?.user_type;
  };
  
  export const hasAccess = (allowedRoles) => {
    const user_type = getUserType();
    return allowedRoles.includes(user_type);
  };
  