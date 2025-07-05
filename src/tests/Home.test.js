import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../pages/Home/Home';
import * as api from '../../src/services/api';
import * as authHook from '../../src/hooks/useAuth';

// Mocks de componentes filhos
jest.mock('../pages/Home/components/InfoUser/InfoUser', () => () => <div>InfoUser Mock</div>);
jest.mock('../pages/Home/components/RegistrationMenu/RegistrationMenu', () => () => <div>RegistrationMenu Mock</div>);
jest.mock('../pages/Home/components/ServicesList/ServicesList', () => () => <div>ServicesList Mock</div>);
jest.mock('../pages/Home/components/HomeFilter/HomeFilter', () => () => <div>HomeFilter Mock</div>);
jest.mock('../pages/Home/HomeClient', () => () => <div>HomeClient Mock</div>);

describe('Home component', () => {
  const mockUser = {
    user: 'lucas',
    email: 'lucas@email.com',
    user_type: 'comercial',
    first_name: 'Lucas',
    last_name: 'Oliveira',
  };

  beforeEach(() => {
    sessionStorage.setItem('user', JSON.stringify(mockUser));

    jest.spyOn(authHook, 'useAuth').mockReturnValue({
      hasAccess: () => true,
      userType: 'comercial',
    });

    jest.spyOn(api, 'fetchServicesByParams').mockResolvedValue({
      data: {
        count: 2,
        results: [
          { id: 1, nome: 'Serviço 1' },
          { id: 2, nome: 'Serviço 2' },
        ],
      },
    });
  });

  afterEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('renderiza os componentes principais', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('InfoUser Mock')).toBeInTheDocument();
      expect(screen.getByText('RegistrationMenu Mock')).toBeInTheDocument();
      expect(screen.getByText('HomeFilter Mock')).toBeInTheDocument();
    });
  });

  test('exibe a paginação corretamente', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // Pagination usa role="navigation"
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  test('troca de página ao clicar na paginação', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    const page1 = screen.getByText('1');
    fireEvent.click(page1);

    // Como a página já é a 1, não deve haver nova requisição
    expect(api.fetchServicesByParams).toHaveBeenCalledTimes(1);
  });

  test('renderiza HomeClient quando user_type for cliente', async () => {
    sessionStorage.setItem(
      'user',
      JSON.stringify({ ...mockUser, user_type: 'cliente' })
    );

    jest.spyOn(authHook, 'useAuth').mockReturnValue({
      hasAccess: () => true,
      userType: 'cliente',
    });

    render(<Home />);
    
    expect(await screen.findByText('HomeClient Mock')).toBeInTheDocument();
  });
});
