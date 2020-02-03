import {MessageType} from './message.type';

export class NodeMessage {
  nodeMessageIdCounter: number;
  nodeMessageID: number;
  type: MessageType;
  message: string;
  sender: string;
}
