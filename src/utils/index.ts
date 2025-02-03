import { config } from '../config';
const { TRELLO_LIST_ID } = config;
/**
 * Extrai o nome do solicitante da descrição do cartão.
 * @param desc - Descrição do cartão.
 * @param keyword - palavra para ser buscada na descrição.
 * @param iscleanText - boolean para ser chamada a função cleanText que retorna uma string somente com letras.
 * @returns Nome do solicitante ou "Não informado" se não encontrado.
 */
export const extractDataByText = (desc: string, keyword: string, iscleanText: boolean = false): string => {
  const match = desc.match(new RegExp(`\\*?\\*?${keyword}\\*?\\*?:\\s*(.+)`, "i"));
  if (match) {
    let extractedText = match[1].trim();
    
    if (iscleanText) {
      extractedText = cleanText(extractedText);
    }
    
    return extractedText;
  }
  
  return "Não informado";
};

/**
 * Retorna uma string sem caractéres especiais, somente letras.
 * @param text - Texto a ser limpo.
 * @returns Texto sem caractéres especiais.
 */
export const cleanText = (text: string) => {
  return text
    .replace(/(\*\*|__)(.*?)\1/g, "$2")  // Remove negrito (**texto** ou __texto__)
    .replace(/(\*|_)(.*?)\1/g, "$2")     // Remove itálico (*texto* ou _texto_)
    .replace(/\n/g, " ")                 // Substitui quebras de linha por espaço
    .replace(/\s{2,}/g, " ")             // Remove múltiplos espaços
    .replace(/[^a-zA-Z0-9çÇáéíóúãõâêô\s]/g, "") // Remove caracteres especiais, mas mantém acentos e ç
    .trim();
};  

/**
 * Retorna o status do card com base na lista e membros atribuídos.
 * @param listId - ID da lista do Trello.
 * @param memberIds - Lista de IDs dos membros atribuídos ao card.
 * @returns "Pendente", "Em andamento" ou "Finalizado".
 */
export const getStatus = (listId: string, memberIds: string[] = []): string => {
  const hasMembers = Array.isArray(memberIds) && memberIds.length > 0;

  if (listId === TRELLO_LIST_ID) {
    return hasMembers ? "Em andamento" : "Pendente";
  }
  
  return "Finalizado";
};