import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      trelloCard?: TrelloCard;
      transformedCard?: TransformedCard;
    }
  }
}

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  dateLastActivity: string;
  start: string | null;
  idList: string;
  idMembers: string[];
  labels: { name: string, id: string }[];
}

export interface TransformedCard {
  id: string;
  name: string;
  desc: string;
  clientName: string;
  requesterName: string;
  status: string;
  dateLastEdited: string;
  dateCreated: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  password?: string;
  email?: string;
  role?: 'implantação' | 'suporte' | 'admin';
}
export interface ChatComment {
  userId: string;
  name: string;
  desc: string;
  date: string;
  isCreatedByChat?: boolean;
}

export interface ChatMessage {
  id: string;
  idMemberCreator: string;
  data: {
    idCard: string;
    text: string;
    card: {
      id: string;
      name: string;
      idShort: number;
      shortLink: string;
    };
    board: {
      id: string;
      name: string;
      shortLink: string;
    };
    list: {
      id: string;
      name: string;
    };
  };
  type: string;
  date: string;
  memberCreator: {
    id: string;
    fullName: string;
    avatarUrl: string;
    username: string;
  }
}

export interface TrelloCardGetById {
  id: string;
  badges: {
    attachmentsByType: {
      trello: {
        board: number;
        card: number;
      };
    };
    externalSource: any;
    location: boolean;
    votes: number;
    viewingMemberVoted: boolean;
    subscribed: boolean;
    attachments: number;
    fogbugz: string;
    checkItems: number;
    checkItemsChecked: number;
    checkItemsEarliestDue: any;
    comments: number;
    description: boolean;
    due: any;
    dueComplete: boolean;
    lastUpdatedByAi: boolean;
    start: any;
  };
  checkItemStates: any[];
  closed: boolean;
  dueComplete: boolean;
  dateLastActivity: string;
  desc: string;
  descData: {
    emoji: Record<string, unknown>;
  };
  due: any;
  dueReminder: any;
  email: any;
  idBoard: string;
  idChecklists: string[];
  idList: string;
  idMembers: string[];
  idMembersVoted: string[];
  idShort: number;
  idAttachmentCover: string;
  labels: {
    id: string;
    idBoard: string;
    idOrganization: string;
    name: string;
    nodeId: string;
    color: string;
    uses: number;
  }[];
  idLabels: string[];
  manualCoverAttachment: boolean;
  name: string;
  pinned: boolean;
  pos: number;
  shortLink: string;
  shortUrl: string;
  start: any;
  subscribed: boolean;
  url: string;
  cover: {
    idAttachment: string;
    color: any;
    idUploadedBackground: any;
    size: string;
    brightness: string;
    scaled: {
      id: string;
      _id: string;
      scaled: boolean;
      url: string;
      bytes: number;
      height: number;
      width: number;
    }[];
    edgeColor: string;
    idPlugin: any;
  };
  isTemplate: boolean;
  cardRole: any;
  mirrorSourceId: any;
}
