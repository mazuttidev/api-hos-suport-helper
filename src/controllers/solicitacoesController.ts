import { Request, Response } from 'express';
import TrelloService from '../services/trelloService';
import { TrelloCard } from '../types/express';
import { config } from '../config';
import fs from 'fs';
import path from 'path';
const { TRELLO_BOARD_ID, TRELLO_LIST_ID } = config;

class SolicitacoesController {
  static async getCards(req: Request, res: Response): Promise<void> {
    try {
      const cards: TrelloCard[] = await TrelloService.fetchCards(TRELLO_BOARD_ID);

      res.status(200).json({
        success: true,
        data: cards,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar Solicitações', error,
      });
    }
  }

  static async createCards(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        costumer,
        product,
        productVersion,
        description,
        connectionType,
        connectionData,
      } = req.body;


      // Verificação de campos obrigatórios
      if (!title || !costumer || !product || !description) {
        res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
        return;
      }

      // Obter informações do solicitante
      const user = (req as any).user;
      const solicitante = user?.name || 'Desconhecido';

      // Incrementar número da solicitação
      const counterFilePath = path.resolve(__dirname, '../db/solicitacaoCounter.json');
      let counter = 1;

      if (fs.existsSync(counterFilePath)) {
        const data = fs.readFileSync(counterFilePath, 'utf-8');
        counter = JSON.parse(data).counter;
      }

      counter += 1;
      fs.writeFileSync(counterFilePath, JSON.stringify({ counter }), 'utf-8');

      // Formatar descrição em Markdown
      const formattedDescription = `
  **Título**: ${title}
  **Cliente**: ${costumer}
  **Produto**: ${product.toUpperCase()}
  **Versão do Produto**: ${productVersion}
  **Tipo de Conexão**: ${connectionType || 'não informado'}
  **Dados da Conexão**: ${connectionData || 'não informado'}
  **Solicitado por**: ${solicitante}
  **Data Solicitação**: ${new Date().toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })}
**Descrição**: ${description}
  `;

      let labelIds: string[] = ['6798f38be6b2389ef12767f3']; // Adicona o "HOS HELPER"
      if (product.toUpperCase() === 'WEB') {
        labelIds = [...labelIds, '65fc8216338ad1792a33b2ef']; // Adiciona o ID para "WEB"
      } else if (product.toUpperCase() === 'DESKTOP') {
        labelIds = [...labelIds, '65fbadeafbeba17fa1bfb025']; // Adiciona o ID para "DESKTOP"
      } else {
        labelIds = [...labelIds, '65dfa4a3e4afc78da0d6e387']; // Adiciona o ID para "INTEGRACAO"
      }


      // Criar o cartão no Trello
      const card = await TrelloService.createCard({
        name: `HOS Helper - SOL-${counter} - ${title}`,
        desc: formattedDescription,
        idList: TRELLO_LIST_ID,
        idLabels: labelIds,
      });

      // Enviar arquivos como anexos ao Trello
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        for (const file of files) {
          await TrelloService.addAttachmentToCard(card.id, file.buffer, file.originalname);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Solicitação criada com sucesso.',
        cardUrl: card.url,
        solicitacaoNumber: counter,
      });
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar solicitação.',
      });
    }
  }


}



export default SolicitacoesController;
