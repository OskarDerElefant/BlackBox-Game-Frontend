import {MessageType} from './message.type';

export class NodeMessage {
  nodeMessageIdCounter: number;
  nodeMessageID: number;
  messagetype: string;
  message: string;
  sender: string;
}
