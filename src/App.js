import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/Home/Home';
import Client from './pages/Client-Form/Client';
import Translator from './pages/Translator-Form/Translator';
import ClientDetails from './pages/ClientsDetails/ClientDetails';
import Layout from './components/Layout/Layout';
import BudgetForm from './pages/Budgets/BudgetForm';
import BudgetsList from './pages/BudgetsList/BudgetsList';
import BudgetDetails from './pages/BudgetsDetails/BudgetDetails';
import Users from './pages/Users/Users';
import ServiceReport from './pages/Services Report/ServiceReport';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Router>
      <Layout>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* 🔹 Rotas acessíveis a todos os usuários autenticados */}
            <Route path="/home" element={<ProtectedRoute allowedRoles={["colaborador","cliente", "comercial", "financeiro", "gerencia", "admin"]}><Home /></ProtectedRoute>} />

            {/* 🔹 Rotas para COLABORADOR */}
            <Route path="/clients" element={<ProtectedRoute allowedRoles={["colaborador", "comercial", "financeiro", "gerencia", "admin"]}><Client /></ProtectedRoute>} />
            <Route path="/clients/:id" element={<ProtectedRoute allowedRoles={["colaborador", "comercial", "financeiro", "gerencia", "admin"]}><ClientDetails /></ProtectedRoute>} />
            <Route path="/translators" element={<ProtectedRoute allowedRoles={["colaborador", "gerencia", "admin"]}><Translator /></ProtectedRoute>} />

            {/* 🔹 Rotas para COMERCIAL */}
            <Route path="/register-budget" element={<ProtectedRoute allowedRoles={["comercial","colaborador", "financeiro", "gerencia", "admin"]}><BudgetForm /></ProtectedRoute>} />
            <Route path="/list-budgets" element={<ProtectedRoute allowedRoles={["comercial","colaborador", "financeiro", "gerencia", "admin"]}><BudgetsList /></ProtectedRoute>} />
            <Route path="/budgets/:budget_id" element={<ProtectedRoute allowedRoles={["colaborador","comercial", "financeiro", "gerencia", "admin"]}><BudgetDetails /></ProtectedRoute>} />

            {/* 🔹 Rotas para GERENTE */}
            <Route path="/users" element={<ProtectedRoute allowedRoles={["gerencia", "admin"]}><Users /></ProtectedRoute>} />

            {/* 🔹 Rotas para ADMIN */}
            <Route path="/services-report" element={<ProtectedRoute allowedRoles={["gerencia", "admin"]}><ServiceReport /></ProtectedRoute>} />          
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
