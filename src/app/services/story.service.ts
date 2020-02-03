import {Injectable} from '@angular/core';
import {NodeMessage} from '../models/node.message';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../models/answer';
import {MessageType} from '../models/message.type';
import {MessageObject} from '../models/message.object';

/**
 * Service for story handling.
 */

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  url = 'http://localhost:9000/api/game/';

  allMessages = [];

  constructor(private http: HttpClient) { }

  /**
   * Erwartet die erste Nachricht, direkt nachdem die Story gewählt wurde.
   **/
  public setSelectedStory(selectedStory: number): Observable<boolean> {
    /*const initialMessage = new NodeMessage();
    initialMessage.message = 'Hallo';
    initialMessage.type = MessageType.Text;
    initialMessage.nodeMessageID = 1;
    return initialMessage*/

    const nextMessageUrl = this.url + 'selectedStory';
    //NUMBER ÜBERGEBEN
    //return this.http.post<MessageObject>(nextMessageUrl, selectedStory);
    return null;
  }

  /**
   * Erwartet die nächste NodeMessage auf Grundlage der ausgewählten Antwort des Nutzers.
   * @param answer
   * Die gewählte Antwort des Nutzers.
   */
  public getNextStoryPoint(answer: Answer): NodeMessage {
    const message = new NodeMessage();
    message.message = 'Hallo';
    message.type = MessageType.Text;
    message.nodeMessageID = 1;
    return message;
  }

  public getNextMessageFromQueue(): Observable<MessageObject> {
    const nextMessageUrl = this.url + 'nextMessage';
    return this.http.get<MessageObject>(nextMessageUrl);
  }

  public sendRepsonseToServer(answerID: number): Observable<boolean> {
    const sendRepsonseUrl = this.url + 'send';
    //return this.http.post(sendRepsonseUrl, answerID);
    return null;
  }

  public saveCurrentPositionInStory(visitedStoryPoint: NodeMessage[]): Observable<NodeMessage[]> {
    return null;
  }

  public loadCurrentPositionInStory(visitedStoryPoint: NodeMessage[]): Observable<NodeMessage[]> {
    return null;
  }

  /**
   * Nachrichten werden lokal gespeichert, um nicht immer auf das Backend zugreifen zu müssen, um den Chat-Verlauf darzustellen.
   * @param message
   * Zu speichernde Nachricht, entweder NodeMessage oder Answer
   */
  public localSaveOfMessages(message: any) {
    this.allMessages.push(message);
  }

  /**
   * Gibt alle lokal gespeicherten Nachrichten zurück.
   */
  public getAllLocalMessages(): any[] {
    return this.allMessages;
  }
}
