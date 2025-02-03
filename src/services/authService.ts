import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const dbPath = path.resolve(__dirname, '../db/mockdb.json');
const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';

interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  password: string;
  role: string;
}

export const authenticateUser = (username: string, password: string): string | null => {
  const users: User[] = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Gerar o token JWT
    const token = jwt.sign({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    },
      secretKey,
      { expiresIn: '12h' });
    return token;
  }

  return null;
};
