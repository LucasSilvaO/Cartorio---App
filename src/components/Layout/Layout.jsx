import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';

const Layout = ({ children }) => {
    const location = useLocation();
    const noHeaderRoutes = ['/', '/register']; // Adicione outras rotas conforme necessário

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#EAEAEA' }}>
            {!noHeaderRoutes.includes(location.pathname) && <Header />}
                {children}
        </div>
    );
};

export default Layout;