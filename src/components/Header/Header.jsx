import React, { useState } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarToggler, Collapse } from 'reactstrap';
import { FaBars } from 'react-icons/fa';
import logo from "../../../src/assets/images/logo.png";
import './css/header.css';
import { getUserType } from '../../utils/auth';

// Definição de menus por cargo
const menuPermissions = {
    colaborador: ["/home", "/translators", "/clients", "/list-budgets"],
    comercial: ["/home", "/clients", "/list-budgets"],
    financeiro: ["/home", "/clients", "/list-budgets", "/financial"],
    gerencia: ["/home", "/translators", "/clients", "/users", "/list-budgets", "/financial", "/services-report"],
    admin: ["/home", "/translators", "/clients", "/users", "/list-budgets", "/financial", "/services-report"]
};

// Definição de todos os itens de navegação
const navItems = [
    { name: 'Dashboard', url: '/home' },
    { name: 'Tradutores', url: '/translators' },
    { name: 'Clientes', url: '/clients' },
    { name: 'Usuários', url: '/users' },
    { name: 'Relatório', url: '/services-report' },
    { name: 'Orçamento', url: '/list-budgets' },
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const userRole = getUserType(); // Pega o cargo do usuário
    const allowedMenus = menuPermissions[userRole] || []; // Filtra os menus

    return (
        <header className="header">
            <Navbar style={{ backgroundColor: "#95be1f", color: "white" }} expand="md">
                <NavbarBrand href="/home" style={{ marginLeft: "10%" }}>
                    <h3 style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "white"
                    }}>Cartório - Lucas</h3>
                </NavbarBrand>
                <NavbarToggler onClick={toggle}>
                    <FaBars style={{ color: "white" }} />
                </NavbarToggler>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mx-auto" navbar style={{ color: "white" }}>
                        {navItems
                            .filter(item => allowedMenus.includes(item.url)) // Exibe apenas os menus permitidos
                            .map((item, index) => (
                                <NavItem key={index} style={{ marginLeft: "15px" }}>
                                    <NavLink href={item.url} style={{ color: "white", transition: "color 0.3s", fontSize: "14px" }}
                                        onMouseEnter={(e) => e.target.style.color = "#ddd"}
                                        onMouseLeave={(e) => e.target.style.color = "white"}>
                                        {item.name}
                                    </NavLink>
                                </NavItem>
                            ))}
                    </Nav>
                </Collapse>
            </Navbar>
        </header>
    );
};

export default Header;