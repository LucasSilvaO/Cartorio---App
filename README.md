# 📜 Cartório APP

Sistema de Cadastro de Orçamentos e Serviços para Cartório

Aplicação web para gerenciar orçamentos e serviços de um cartório, permitindo o cadastro, edição e consulta de clientes, tradutores e serviços realizados. Ideal para agilizar o atendimento e a organização de demandas internas.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- [React](https://reactjs.org/) – Interface SPA dinâmica
- [Vite](https://vitejs.dev/) – Build rápido e leve
- [Tailwind CSS](https://tailwindcss.com/) (opcional, se estiver usando)
- [Vercel](https://vercel.com/) – Deploy do frontend

### Backend
- [Python 3.x](https://www.python.org/)
- [Django](https://www.djangoproject.com/) – Framework backend robusto
- [Django REST Framework](https://www.django-rest-framework.org/) – Criação da API REST
- [django-cors-headers](https://pypi.org/project/django-cors-headers/) – Configuração de CORS
- [Gunicorn](https://gunicorn.org/) + [Nginx](https://www.nginx.com/) – Servidor de produção
- [EC2 AWS](https://aws.amazon.com/ec2/) – Hospedagem do backend

---

## ⚙️ Funcionalidades

- ✅ Cadastro de clientes e tradutores
- ✅ Criação de orçamentos e serviços
- ✅ Edição e exclusão de registros
- ✅ Consulta rápida com filtros
- ✅ Interface amigável e responsiva
- ✅ API REST integrada com autenticação

---

## 🧩 Como Rodar Localmente

### Backend (Django)

1. Clone o repositório e acesse a pasta backend:
   ```
   git clone https://github.com/seu-usuario/cartorio-app.git
   cd cartorio-app/backend
   ```
Crie e ative o ambiente virtual:
```
python -m venv venv
source venv/bin/activate  # no Windows: venv\Scripts\activate
Instale as dependências:
```
```
pip install -r requirements.txt
Rode as migrações:
python manage.py migrate
```
Inicie o servidor:
```
python manage.py runserver
```
Frontend (React)
Acesse a pasta frontend:

```
cd ../frontend
```
Instale as dependências:

```
npm install
```
Rode a aplicação:
```
npm run dev
```
O frontend ficará disponível em http://localhost:5173 e se comunicará com a API Django.

🌐 Deploy
Frontend: Vercel – https://cartorio-app.vercel.app

Backend: Django hospedado em EC2, acessado via API Gateway da AWS com proxy para /dev/api/.

🛡️ Segurança
Configurado CORS com django-cors-headers para aceitar somente domínios autorizados.

Proteção CSRF e autenticação via tokens (JWT ou Session, conforme implementado).

Logs e tratamento de erros no servidor.
