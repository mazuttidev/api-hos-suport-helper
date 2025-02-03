import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import SolicitacoesController from './controllers/solicitacoesController';
import chatController from './controllers/chatController';
import authMiddleware from './middlewares/authMiddleware';
import authController from './controllers/authController';
import upload from './middlewares/uploadMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.post(
  '/login',
  authController.login
);
app.get(
  '/solicitacoes',
  authMiddleware,
  SolicitacoesController.getCards
);
app.post(
  '/solicitacoes/nova-solicitacao',
  authMiddleware,
  upload.array('files'),
  SolicitacoesController.createCards
);
app.get(
  '/chat/:cardId',
  authMiddleware,
  chatController.getChat
);
app.post(
  '/chat/:cardId/nova-mensagem',
  authMiddleware,
  upload.array('files'),
  chatController.createComment
);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});