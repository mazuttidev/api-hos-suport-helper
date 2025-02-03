import { Request, Response } from 'express';
import { authenticateUser } from '../services/authService';
import fs from 'fs';
import path from 'path';

interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  password: string;
  role: string;
}

const login = (req: Request, res: Response): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    return;
  }

  // Autentica o usuário e retorna o token JWT
  const token = authenticateUser(username, password);

  if (token) {
    // Busca os dados completos do usuário
    const user = getUserData(username);

    if (user) {
      // Envia o token e todas as informações relevantes do usuário
      res.status(200).json({
        apiKey: token,
        user: {
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado.' });
    }
  } else {
    res.status(401).json({ message: 'Usuário e senha inválidos.' });
  }
};

// Função para buscar os dados completos do usuário
const getUserData = (username: string): User | null => {
  const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../db/mockdb.json'), 'utf-8'));
  const user = users.find((u: User) => u.username === username);
  return user || null; // Retorna null se o usuário não for encontrado
};

export default { login };
