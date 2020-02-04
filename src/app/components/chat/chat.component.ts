import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StringConstants} from '../../constants/string-constants';
import {StoryService} from '../../services/story.service';
import {NodeMessage} from '../../models/node.message';
import {Answer} from '../../models/answer';
import {MessageObject} from '../../models/message.object';
import {MessageType} from '../../models/message.type';
import {element} from 'protractor';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  storyTitle = '';

  selectedStory: string;
  selectedStoryNumber: number;

  userName = 'NUTZERNAMEN ANZEIGEN';
  answers: Answer[] = [];
  inputField: any;

  selectableAnswers: Answer[];
  selectedAnswer: string;

  messages: any[] = [];

  constructor(private route: ActivatedRoute, private storyService: StoryService) {
  }

  ngOnInit() {
    this.setBasicConfiguration();
    this.userName = sessionStorage.getItem('username');
    this.setPositionOfSelection();
  }

  /**
   * Ruft die Grundlegenden Funktionen auf:
   * Wenn der Nutzer durch die Anwendung navigiert und später zurück auf die Chat-Page kommt, werden die vorhandenen Daten lokal geladen.
   * Wenn der Nutzer ein neues Spiel startet und auf die Chat-Page kommt, wird das gewählte Scenario gesetzt.
   */
  setBasicConfiguration() {
    this.selectedStory = this.route.snapshot.paramMap.get('selectedStory');
    if (this.storyService.getAllLocalMessages() != null && this.storyService.getAllLocalMessages().length > 0) {
      //this.setAllMessagesBasedOnLocalStorage();
    } else if(this.selectedStory === StringConstants.MURDER_STORY) {
        this.selectedStoryNumber = 0;
        this.storyTitle = 'Mord in der Zukunft';
        this.setSelectedStory();
    } else if(this.selectedStory === StringConstants.TREASURE_STORY) {
        this.selectedStoryNumber = 1;
        this.storyTitle = 'Der verlorene Schatz';
        this.setSelectedStory();
    } else {
      console.log('NOMESSAGE');
      this.setAllMessagesBasedOnLocalStorage();
    }
  }

  /**
   * Sendet die Nummer des gewählten Szenarios an das Backend.
   * Bei erfolgreicher Antwort des Backends wird angefangen die Nachrichten abzurufen.
   */
  setSelectedStory() {
    const userID = Number(sessionStorage.getItem('userID'));
    this.storyService.setSelectedStory(this.selectedStoryNumber, userID).subscribe(
      isStorySelected => {
        if (isStorySelected) {
          this.getNextMessage(userID);
        }
      }
    );
  }

  /**
   * Ermittelt die nächste Nachricht vom Backend.
   * Wird eine NodeMessage erhalten, ist es eine Nachricht vom Chat-partner, welche dann angezeigt wird.
   * Wird eine AnswerList erhalten, handelt es sich um die Antwortmöglichkeiten, welche der Spieler hat. Es handelt sich dabei um ein Array des Typs Answer.
   * Wird eine Servermessage erhalten, handelt es sich um die Rückmeldung des Servers, dass keine neuen Nachrichten erhalten werden.
   * @param userID
   */
  getNextMessage(userID: number) {
    this.storyService.getNextMessageFromQueue(userID).subscribe( messages => {
      if(messages == null || messages.length < 1) {
        this.getNextMessage(userID);
      } else {
        const recievedMessages = messages;
        recievedMessages.forEach(message => {
          console.log(message.answertype);
          if(message.answertype === 'NodeMessage') {
            console.log(message.msg);
            this.createBotMessageToDisplay(message.msg);
            this.getNextMessage(userID);
          } else if(message.answertype === 'AnswerList') {
            this.setAnswers(message.msg);
          } else if(message.answertype === 'Servermessage') {

          }
          // Es muss gewartet werden bis nachricht da ist.
        });
      }
    });
  }

  /**
   * NodeMessages sind nicht kompatibel mit Nachrichten, die der Chat anzeigen kann.
   * Eine NodeMessage wird in eine message umgewandelt.
   * @param nodeMessage
   * Die umzuwandelnde Nachricht.
   */
  createBotMessageToDisplay(nodeMessage: NodeMessage) {
    if (nodeMessage.messagetype === 'Text') {
      this.messages.push({
        text: nodeMessage.message,
        reply: false,
        user: {
          name: nodeMessage.sender,
        }
      });
      this.storyService.localSaveOfMessages(nodeMessage);
    } else if (nodeMessage.messagetype === 'Image') {
      const url = '/assets' + nodeMessage.message;
      this.messages.push({
        type: 'file',
        reply: false,
        files: [ { url: '/assets' + nodeMessage.message, type: 'image/jpg' }],
        user: {
          name: nodeMessage.sender,
        }
      });
      this.storyService.localSaveOfMessages(nodeMessage);
    } else if (nodeMessage.messagetype === 'Video') {
      const url = '/assets' + nodeMessage.message;
      this.messages.push({
        type: 'file',
        reply: false,
        files: [ { url: '/assets' + nodeMessage.message, type: 'video/mp4' }],
        user: {
          name: nodeMessage.sender,
        }
      });
      this.storyService.localSaveOfMessages(nodeMessage);
    } else if (nodeMessage.messagetype === 'Voice') {
      const url = '/assets' + nodeMessage.message;
      this.messages.push({
        type: 'file',
        reply: false,
        files: [ { url: '/assets' + nodeMessage.message, type: 'audio/mp3' }],
        user: {
          name: nodeMessage.sender,
        }
      });
      this.storyService.localSaveOfMessages(nodeMessage);
    }

  }

  /**
   * Objekte des Typs Answer sind nicht kompatibel mit Nachrichten, die der Chat anzeigen kann.
   * Eine Answer wird in eine message umgewandelt.
   * @param answer
   * Anzuzeigende Nachricht.
   */
  createUserMessageToDisplay(answer: Answer) {
    this.messages.push({
      text: answer.answerMessage,
      reply: true,
      user: {
        name: this.userName,
      },
    });
  }

  /**
   * Wenn alle Nachrichten einer Node erhalten wurden, werden die Antworten geschickt.
   * Sobald dies geschieht erhält der Nutzer die Möglichkeit, aus diesen auszuwählen und zu antworten.
   * Wenn die Liste nur die Größe 1 hat handelt es sich um das erneute Laden des Chats. Die Antwort wurde bereits gegeben und wird nun angezeigt.
   */
  setAnswers(possibilities: Answer[]) {
    this.selectableAnswers = [];
    if(possibilities.length > 1) {
      this.selectableAnswers = possibilities;
    } else {
      this.createUserMessageToDisplay(possibilities[0]);
    }
  }

  /**
   * Zuerst wird die ausgewählte Antwort ermittelt.
   * Diese wird dann im Chat angezeigt und danach an das Backend gesendet.
   * Wenn das Backend erfolgreich antwortet wird die nächste Nachricht abegrufen.
   */
  sendAnswer() {
    const userID = Number(sessionStorage.getItem('userID'));
    this.selectableAnswers.forEach(answer => {
      if (answer.answerMessage === this.selectedAnswer) {
        console.log('Treffer');
        console.log(answer.answerID);
        this.createUserMessageToDisplay(answer);
        this.storyService.sendRepsonseToServer(answer.answerID, userID).subscribe(
          isAnswerOk => {
            this.answers = [];
            this.selectedAnswer = null;
            if(isAnswerOk) {
              this.getNextMessage(userID);
            }
          }
        );
      }
    });
  }

  /**
   * Holt alle Nachrichten, die lokal gespeichert werden. Beispielsweise beim Aufruf der Seite.
   * Wird nur relevant, wenn der Nutzer schon im Spiel ist.
   */
  setAllMessagesBasedOnLocalStorage() {
    this.messages = [];
    const allMessages = this.storyService.getAllLocalMessages();
    console.log('ALLLLLL ' + allMessages);
    if(allMessages.length > 0) {
      allMessages.forEach(element => {
        if(element instanceof NodeMessage) {
          this.createBotMessageToDisplay(element);
        } else if(element instanceof Answer) {
          this.createUserMessageToDisplay(element);
        }
      });
    }
  }

  setPositionOfSelection() {
    /* const x = document.getElementsByTagName('input');
     this.inputField = x[0].getBoundingClientRect();
     const selection = document.getElementById('selection');
     console.log(this.inputField.width);
     selection.style.width = this.inputField.width + 'px';
     selection.style.height = this.inputField.height + 'px';
    /* selection.style.position = 'absolute';
     selection.style.left = this.inputField.left + 'px';
     selection.style.top = 0+'px';*/
    /*console.log(selection.style.width);
    this.inputField.hidden = true;*/

    const x = document.getElementsByTagName('input');
    let t = x[0].getBoundingClientRect();
    console.log('TOP: ' + t.top + pageYOffset );
    console.log('Left: ' + t.left + pageXOffset );
  }
}
