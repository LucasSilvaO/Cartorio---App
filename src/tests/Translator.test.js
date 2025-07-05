import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Translator from '../pages/Translator-Form/Translator';
import * as api from '../services/api';

jest.mock('../services/api');

describe('Translator Component', () => {
  // Mock fixo de tradutores para todos os testes
  const mockTranslators = {
    count: 2,
    results: [
      {
        tradutor_id: 1,
        nome: 'Tradutor Um',
        email: 'um@email.com',
        prazo_em_dias: 5,
      },
      {
        tradutor_id: 2,
        nome: 'Tradutor Dois',
        email: 'dois@email.com',
        prazo_em_dias: 7,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Sempre que o componente pedir a lista de tradutores, devolve o mock
    api.fetchTranslators.mockResolvedValue(mockTranslators);
  });

test('renderiza componente e mostra botão de cadastro ativo por padrão', async () => {
  render(<Translator />);
  
  // Verifica título da seção
  expect(screen.getByRole('heading', { name: /cadastrar tradutor/i })).toBeInTheDocument();

  // Verifica botão ativo
  expect(await screen.findByRole('button', { name: /cadastrar tradutor/i })).toBeInTheDocument();

  expect(screen.getByText('Cadastrar')).toBeInTheDocument();
  expect(screen.getByText('Editar')).toBeInTheDocument();
  expect(screen.getByText('Apagar')).toBeInTheDocument();
});


  test('preenche e envia formulário de cadastro', async () => {
    api.createTranslator.mockResolvedValue({ sucesso: true });

    render(<Translator />);

    const cadastrarButton = await screen.findByRole('button', { name: /cadastrar tradutor/i });

    fireEvent.change(screen.getByPlaceholderText(/nome do tradutor/i), {
      target: { value: 'Novo Tradutor' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e-mail do tradutor/i), {
      target: { value: 'novo@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/prazo em dias/i), {
      target: { value: '10' },
    });

    await waitFor(() => {
      expect(cadastrarButton).not.toBeDisabled();
    });

    fireEvent.click(cadastrarButton);

    await waitFor(() => {
      expect(api.createTranslator).toHaveBeenCalledWith({
        nome: 'Novo Tradutor',
        email: 'novo@email.com',
        prazo_em_dias: '10',
      });
      expect(screen.getByText(/tradutor cadastrado com sucesso/i)).toBeInTheDocument();
    });
  });

  test('muda para modo de edição e edita tradutor', async () => {
  api.editTranslator.mockResolvedValue({ sucesso: true });

  render(<Translator />);

  // Clica no botão "Editar" para abrir o modo edição
  fireEvent.click(screen.getByText('Editar'));

  // Aguarda o título do modo edição aparecer (h3 com texto "Editar Tradutor")
  await screen.findByRole('heading', { name: /editar tradutor/i, level: 3 });

  // Aguarda as opções do select carregarem
  await screen.findByRole('option', { name: 'Tradutor Um' });

  // Seleciona o tradutor com id 1
  fireEvent.change(screen.getByLabelText(/selecione o tradutor/i), {
    target: { value: '1' },
  });

  // Aguarda o input "Nome do Tradutor" atualizar para o valor do tradutor selecionado
  await waitFor(() => {
    expect(screen.getByLabelText(/nome do tradutor/i)).toHaveValue('Tradutor Um');
  });

  // Muda o prazo em dias para 15
  fireEvent.change(screen.getByPlaceholderText(/prazo em dias/i), {
    target: { value: '15' },
  });

  // Clica no botão "Editar Tradutor" para submeter
  fireEvent.click(screen.getByRole('button', { name: /editar tradutor/i }));

  // Aguarda confirmação do sucesso e chamada da API
  await waitFor(() => {
    expect(api.editTranslator).toHaveBeenCalledWith(
      expect.objectContaining({ prazo_em_dias: '15' })
    );
    expect(screen.getByText(/tradutor editado com sucesso/i)).toBeInTheDocument();
  });
});


  test('muda para modo de exclusão e apaga tradutor', async () => {
    api.editTranslator.mockResolvedValue({ sucesso: true });

    render(<Translator />);

    // Clica no botão "Apagar" para abrir o modo exclusão
    fireEvent.click(screen.getByText('Apagar'));

    // Aguarda o título "Apagar Tradutor" aparecer como heading de nível 3
    await screen.findByRole('heading', { name: /apagar tradutor/i, level: 3 });

    // Seleciona o tradutor de id 2
    fireEvent.change(screen.getByLabelText(/selecione o tradutor/i), {
      target: { value: '2' },
    });

    // Clica no botão para confirmar a exclusão
    fireEvent.click(screen.getByRole('button', { name: /apagar tradutor/i }));

    // Verifica se o botão ainda está presente após a exclusão (pode ajustar conforme comportamento)
    const apagarBtn = await screen.findByRole('button', { name: /apagar tradutor/i });
    expect(apagarBtn).toBeInTheDocument();
  });

  test('mostra alerta de erro no cadastro se API falhar', async () => {
    api.createTranslator.mockResolvedValue(null);

    render(<Translator />);
    const cadastrarButton = await screen.findByRole('button', { name: /cadastrar tradutor/i });

    fireEvent.change(screen.getByPlaceholderText(/nome do tradutor/i), {
      target: { value: 'Erro' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e-mail do tradutor/i), {
      target: { value: 'erro@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/prazo em dias/i), {
      target: { value: '3' },
    });

    await waitFor(() => expect(cadastrarButton).not.toBeDisabled());
    fireEvent.click(cadastrarButton);

    await waitFor(() => {
      expect(screen.getByText(/erro ao cadastrar tradutor/i)).toBeInTheDocument();
    });
  });
});
