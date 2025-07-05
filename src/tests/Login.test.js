import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/login/Login';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock da imagem e config
jest.mock('../assets/images/logo2.png', () => 'logo.png');
jest.mock('../config/config', () => ({
  API_BACK_URL: 'http://mocked-api.com',
}));

// Mock de navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Limpa sessionStorage antes de cada teste
    sessionStorage.clear();
  });

  test('renderiza campos de login e botão', () => {
    render(<Login />, { wrapper: MemoryRouter });

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('preenche os inputs e realiza login com sucesso', async () => {
    const mockResponse = {
      token: 'fake-token',
      username: 'usuario-teste'
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    );

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'usuario' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'senha123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://mocked-api.com/login/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Headers),
        })
      );

      expect(sessionStorage.getItem('token')).toBe('fake-token');
      expect(sessionStorage.getItem('user')).toContain('usuario-teste');
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  test('exibe alerta de erro em login inválido', async () => {
    const mockError = { detail: 'Credenciais inválidas' };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockError),
      })
    );

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'usuario' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'errado' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});
