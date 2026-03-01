<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&pause=1000&color=00D9FF&center=true&vCenter=true&width=700&lines=HealthSa%C3%BAde+Dashboard+%F0%9F%8F%A5;Monitore+%7C+Treine+%7C+Se+Alimente+Bem!" alt="Typing SVG" />

<br/>

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://saude-saude-dashboard.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://health-dashboard-4qxq.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-dieyksantos-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dieyksantos)

<br/>

> 🏥 Plataforma inteligente de saúde pessoal que monitora seus indicadores, calcula seu IMC e gera **planos de alimentação e treino personalizados** com base nos seus dados — tudo em um dashboard interativo com exportação em PDF.

<br/>

**[🚀 Acessar o Projeto](https://health-saude-dashboard.vercel.app)** · **[📡 API Docs](https://health-dashboard-4qxq.onrender.com/docs)** · **[🐛 Reportar Bug](https://github.com/dieyksantos/healthSaude-dashboard/issues)**

</div>

---

## 📸 Preview

<div align="center">
  <!-- Substitua pela imagem real do projeto -->
  <img src="https://via.placeholder.com/900x500/0d1117/00D9FF?text=HealthSaúde+Dashboard" alt="Preview do HealthSaúde Dashboard" width="100%" style="border-radius: 10px"/>
</div>

---

## ✨ Funcionalidades

- 📊 **Dashboard interativo** com gráficos de evolução dos indicadores de saúde
- ⚖️ **Cálculo de IMC** com classificação e acompanhamento histórico
- 🥗 **Geração de plano alimentar personalizado** com base no IMC e perfil do usuário
- 🏋️ **Geração de plano de treino personalizado** adaptado ao seu condicionamento físico
- 📄 **Exportação de relatórios em PDF** com todos os dados e planos gerados
- 🩺 **Registro de indicadores de saúde** como pressão arterial, glicose e outros
- 🔗 **API REST** completa e documentada com FastAPI

---

## 🛠️ Tecnologias

### Frontend
<div>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
</div>

### Backend
<div>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Uvicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=white" />
</div>

### Deploy & Ferramentas
<div>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" />
</div>

---

## 🏗️ Estrutura do Projeto

```
healthSaude-dashboard/
├── 📁 Frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│   └── package.json
│
├── 📁 backend/           # Python + FastAPI
│   ├── app/
│   │   ├── core/         # Configurações e banco de dados
│   │   ├── models/       # Modelos SQLAlchemy
│   │   ├── routes/       # Endpoints da API
│   │   ├── schemas/      # Schemas Pydantic
│   │   ├── services/     # Lógica de negócio
│   │   └── main.py
│   └── requirements.txt
│
└── .gitignore
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- Python 3.11+

### Backend

```bash
# Entre na pasta do backend
cd backend

# Crie o ambiente virtual
python -m venv env
source env/bin/activate  # Linux/Mac
env\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt

# Rode o servidor
uvicorn app.main:app --reload
```

> API disponível em `http://localhost:8000` · Docs em `http://localhost:8000/docs`

### Frontend

```bash
# Entre na pasta do frontend
cd Frontend

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
echo "VITE_API_URL=http://localhost:8000" > .env

# Rode o projeto
npm run dev
```

> Frontend disponível em `http://localhost:5173`

---

## 🌐 Deploy

| Serviço | URL |
|---------|-----|
| 🖥️ Frontend (Vercel) | [saude-saude-dashboard.vercel.app](https://health-saude-dashboard.vercel.app) |
| ⚙️ Backend (Render) | [health-dashboard-4qxq.onrender.com](https://health-dashboard-4qxq.onrender.com) |
| 📚 API Docs | [health-dashboard-4qxq.onrender.com/docs](https://health-dashboard-4qxq.onrender.com/docs) |

---

## 👨‍💻 Autor

<div align="center">
  <a href="https://github.com/dieyksantos">
    <img src="https://github.com/dieyksantos.png" width="100px" style="border-radius: 50%"/>
    <br/>
    <strong>Dieykson Santos</strong>
  </a>
  <br/><br/>

  [![GitHub](https://img.shields.io/badge/GitHub-dieyksantos-181717?style=flat-square&logo=github)](https://github.com/dieyksantos)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Dieykson%20Santos-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/dieykson-pereira/)
</div>

---

<div align="center">
  <sub>Feito com ❤️ por <a href="https://github.com/dieyksantos">Dieykson Santos</a></sub>
</div>
