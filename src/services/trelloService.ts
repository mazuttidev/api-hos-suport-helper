import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { TrelloCard, TrelloCardGetById } from '../types/express';
import { extractDataByText, getStatus } from "../utils";
import FormData from 'form-data';

interface CreateCardPayload {
  name: string;
  desc: string;
  idList: string;
  idLabels: string[];
}

class TrelloService {
  private axiosInstance: AxiosInstance;

  constructor() {
    const { TRELLO_BASE_URL, TRELLO_API_KEY, TRELLO_API_TOKEN } = config;

    // Configuração base para o Axios
    this.axiosInstance = axios.create({
      baseURL: TRELLO_BASE_URL,
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_API_TOKEN,
      },
    });
  }

  async fetchCardsById(cardId: string): Promise<TrelloCardGetById> {
    try {
      const response = await this.axiosInstance.get(`/cards/${cardId}`);

      return response.data;
    } catch (error) {
      throw new Error("Não foi possível obter os dados do cartão.");
    }
  };

  // Método para buscar os cartões de um quadro específico
  async fetchCards(boardId: string): Promise<any> {
    const response = await this.axiosInstance.get(`/boards/${boardId}/cards`);
    const cards = response.data;
    // Filtro para cartões com a etiqueta HOS HELPER = '6798f38be6b2389ef12767f3'
    const filteredCards = cards.filter((card: TrelloCard) =>
      card.labels.some((label: { id: string }) => label.id === '6798f38be6b2389ef12767f3')
    );

    const allSolicitacoes = filteredCards.map((card: TrelloCard) => {
      const clientName = extractDataByText(card.desc, 'Cliente', false); 
      const requesterName = extractDataByText(card.desc, 'Solicitado por', false);
      const dateCreated = extractDataByText(card.desc, 'Data Solicitação', false); 
      const status = getStatus(card.idList, card.idMembers);

      return {
        id: card.id,
        name: card.name,
        desc: card.desc,
        clientName,
        requesterName,
        status: `${status}`, 
        dateLastEdited: card.dateLastActivity,
        dateCreated: dateCreated,
      };
    });

    return allSolicitacoes;
  }

  // Método para buscar os comentários de um cartão
  async fetchComments(cardId: string): Promise<any> {
    try {
      const response = await  this.axiosInstance.get(`/cards/${cardId}/actions`, {
        params: {
          filter: 'commentCard',
        },
      });

      // Mapeando os comentários para um array de objetos com as informações desejadas
      const comments = response.data.map((action: any) => ({
        userId: action.memberCreator.id,
        name: action.memberCreator.fullName,
        desc: action.data.text,
        date: action.date,
      }));

      // Ordenando os comentários pela data
      comments.sort((a: any, b: any) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      // Retorna o array de comentários ordenado
      return comments;
    } catch (error) {
      throw error;
    }
  }

  // Método para criar um novo cartão
  async createCard(payload: CreateCardPayload) {

    const response = await  this.axiosInstance.post(
      `/cards`,
      {
        ...payload,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  }

  async addAttachmentToCard(cardId: string, fileBuffer: Buffer, fileName: string): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, fileName);

      const response = await  this.axiosInstance.post(
        `/cards/${cardId}/attachments`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      // Retorna a URL do anexo
      return response.data.url;
    } catch (error) {
      return null;
    }
  }


  async addCommentToCard(cardId: string, commentText: string): Promise<void> {
    try {
      const response = await this.axiosInstance.post(
        `/cards/${cardId}/actions/comments`,
        {
          text: commentText,
        }
      );

    } catch (error) {
      throw error;
    }
  }
}

export default new TrelloService();
