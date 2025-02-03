import { Request, Response } from 'express';
import TrelloService from '../services/trelloService';
import { ChatComment } from '../types/express';
import { config } from '../config';
import normalize from 'normalize-text';
import { cleanText, extractDataByText, getStatus } from '../utils/index';
const { TRELLO_API_USER_ID } = config;

class chatController {

  static async getChat(req: Request, res: Response): Promise<void> {
    try {
      const { cardId } = req.params;
      let comments: ChatComment[] = await TrelloService.fetchComments(cardId);

      // Função para normalizar e verificar se contém "NÃO LISTAR COMENTÁRIO"
      const shouldExcludeComment = (desc?: string) => {
        if (!desc) return false;
        const normalizedDesc = normalize(desc).toLowerCase();
        return normalizedDesc.includes("@suporteanalise");
      };

      // Filtra os comentários, removendo os que contêm a frase para não listar
      comments = comments.filter(comment => !shouldExcludeComment(comment.desc));

      // Altera o nome do usuário do chat
      comments = comments.map(comment => {
        if (comment.userId === TRELLO_API_USER_ID) {
          const nameMatch = extractDataByText(comment.desc, "Nome", true);
          console.log("Nome extraído:", nameMatch);

          // Se o nome não for válido, manter os valores originais
          if (!nameMatch || nameMatch === "Não informado") {
            return {
              ...comment,
              isCreatedByChat: true,
            };
          }

          // Limpa o nome e remove do texto original
          const newName = cleanText(nameMatch);
          const newDesc = comment.desc.replace(new RegExp(`Nome:\\s*${nameMatch}`, "i"), "").trim();

          return {
            ...comment,
            name: newName,
            desc: newDesc,
            isCreatedByChat: true,
          };
        }
        return comment;
      });


      res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao buscar Chat",
        error,
      });
    }
  }

  static async createComment(req: Request, res: Response): Promise<void | any> {

    const { cardId, text } = req.body;
    const card = await TrelloService.fetchCardsById(cardId);
    const status = getStatus(card.idList, card.idMembers);

    if (status == "Finalizado") {
      return res.status(403).json({ error: "Esse cartão já foi finalizado, abra uma nova solicitação ou fale com o responsável." });
    }

    try {
      const files = req.files as Express.Multer.File[];

      if (!cardId || !text) {
        return res.status(400).json({ error: "Parâmetros inválidos" });
      }

      let attachmentLinks: string[] = [];

      // Adiciona os arquivos ao Trello e pega os links
      if (files && files.length > 0) {
        for (const file of files) {
          const attachmentUrl = await TrelloService.addAttachmentToCard(cardId, file.buffer, file.originalname);
          if (attachmentUrl) {
            attachmentLinks.push(attachmentUrl);
          }
        }
      }

      const user = (req as any).user;
      const solicitante = user?.name || 'Desconhecido';

      // Monta o comentário com os links das imagens
      let commentText = `**Nome: ${solicitante}**\n ${text}`;
      // let commentText = text;
      if (attachmentLinks.length > 0) {
        const formattedLinks = attachmentLinks.map((url) => `![Arquivo](${url})`).join("\n");
        commentText += `\n\n**Arquivos anexados:**\n${formattedLinks}`;
      }

      // Criar comentário no Trello com os links
      await TrelloService.addCommentToCard(cardId, commentText);

      res.json({ success: true, message: "Comentário enviado com sucesso!" });
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      res.status(500).json({ error: "Erro ao enviar comentário" });
    }
  }


}



export default chatController;
