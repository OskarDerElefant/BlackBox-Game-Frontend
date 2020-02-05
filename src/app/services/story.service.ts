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

  url = 'http://localhost:9000/BlackboxWeb/';

  allMessages = [];

  constructor(private http: HttpClient) { }

  /**
   * Setzt das gewählte Szenario.
   **/
  public setSelectedStory(scenarioID: number, userID: number): Observable<boolean> {
    const nextMessageUrl = this.url + 'setSelectedStory?';
    const params = 'scenarioID=' + scenarioID + '&' + 'userID=' + userID;
    return this.http.get<any>(nextMessageUrl + params);
  }


  public getNextMessageFromQueue(userID: number): Observable<any[]> {
    const nextMessageUrl = this.url + 'getNextMessage?';
    const params = 'userID=' + userID;
    return this.http.get<string[]>(nextMessageUrl + params);
  }

  /**
   * Sendet die ausgewählte Antwort an das Backend
   * @param answerID
   * Die ID der ausgewählten Antwort.
   * @param userID
   * Die ID des Spielers.
   */
  public sendRepsonseToServer(answerID: number, userID: number): Observable<boolean> {
    const sendRepsonseUrl = this.url + 'sendResponseToServer?';
    const params = 'answerID=' + answerID + '&' + 'userID=' + userID;
    return this.http.get<boolean>(sendRepsonseUrl + params);
  }

  /**
   * Wenn der Nutzer sich erneut einloggt und ein offenes Spiel hat, wirde dieses geladen
   * @param userID
   */
  restartCurrentGame(userID: number): Observable<boolean> {
    const currentGameUrl = this.url + 'restartCurrentGame?';
    const params = 'userID=' + userID;
    return this.http.get<any>(currentGameUrl + params);
  }


  /**
   * Nachrichten werden lokal gespeichert, um nicht immer auf das Backend zugreifen zu müssen, um den Chat-Verlauf darzustellen.
   * @param message
   * Zu speichernde Nachricht, entweder NodeMessage oder Answer
   */
  public localSaveOfMessages(message: any) {
    if(sessionStorage.getItem('allMessages') != null) {
      console.log('lokaler storage nicht leer ' + sessionStorage.getItem('allMessages'));
      let allMessages = JSON.parse(sessionStorage.getItem('allMessages'));
      allMessages.push(message);
      sessionStorage.setItem('allMessages', JSON.stringify(allMessages));
    } else {
      let allMessages = [];
      allMessages.push(message);
      sessionStorage.setItem('allMessages', JSON.stringify(allMessages));
      console.log('LOKALER STORAGE LEER');
    }
  }

  /**
   * Gibt alle lokal gespeicherten Nachrichten zurück.
   */
  public getAllLocalMessages(): any[] {
    return JSON.parse(sessionStorage.getItem('allMessages'));
  }

  public resetAllLocalMessages() {
    sessionStorage.removeItem('allMessages');
  }
}
