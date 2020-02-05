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

  isMessageInQueue = false;

  userName = 'NUTZERNAMEN ANZEIGEN';
  answers: Answer[] = [];
  inputField: any;

  selectableAnswers: Answer[];
  selectedAnswer: string;

  messages: any[] = [];

  constructor(private route: ActivatedRoute, private storyService: StoryService) {
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('username');
    this.setBasicConfiguration();
    this.setPositionOfSelection();
  }

  /**
   * Ruft die Grundlegenden Funktionen auf:
   * Wenn der Nutzer durch die Anwendung navigiert und später zurück auf die Chat-Page kommt, werden die vorhandenen Daten lokal geladen.
   * Wenn der Nutzer ein neues Spiel startet und auf die Chat-Page kommt, wird das gewählte Scenario gesetzt.
   */
  setBasicConfiguration() {
    this.selectedStory = this.route.snapshot.paramMap.get('selectedStory');
    if(this.selectedStory == null) {
      if (this.storyService.getAllLocalMessages() != null && this.storyService.getAllLocalMessages().length > 0) {
        this.setAllMessagesBasedOnLocalStorage();
        this.checkForStoryTitle();
      } else {
        console.log('test');
        this.getNextMessage(Number(sessionStorage.getItem('userID')));
      }
    } else {
      if(this.selectedStory === StringConstants.MURDER_STORY) {
        this.selectedStoryNumber = 0;
        this.storyTitle = 'Mord in der Zukunft';
        this.setSelectedStory();
      } else if(this.selectedStory === StringConstants.TREASURE_STORY) {
        this.selectedStoryNumber = 1;
        this.storyTitle = 'Der verlorene Schatz';
        this.setSelectedStory();
      }
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
        console.log('MESSAGES.LENGTH ' + this.messages.length);
        if(this.messages.length === 1) {
          console.log('CHECK TITLE');
          this.checkForStoryTitle();
        }
        const recievedMessages = messages;
        for(let i = 0; i < recievedMessages.length; i++) {
          console.log(recievedMessages[i].answertype + 'MESSAGE' + i);
          if(recievedMessages[i].answertype === 'NodeMessage') {
            console.log(recievedMessages[i].msg);
            if(recievedMessages[i].msg.messagetype === 'Servermessage') {
              this.storyService.deleteLastAnswers();
              this.createEndMessage(recievedMessages[i].msg);
            }
            console.log(recievedMessages[i].msg.sender);
            if(recievedMessages[i].msg.sender !== 'Ich') {
              console.log('SEND BOT MESSAGE');
              this.createBotMessageToDisplay(recievedMessages[i].msg);
              if(i === (recievedMessages[i].length - 1)) {
                this.getNextMessage(userID);
                this.storyService.deleteLastAnswers();
              }
            }
          } else if(recievedMessages[i].answertype === 'AnswerList') {
            this.setAnswers(recievedMessages[i].msg);
          }
        }
        /*recievedMessages.forEach(message => {
          console.log(message + 'MESSAGE');
          if(message.answertype === 'NodeMessage') {
            console.log(message.msg);
            if(message.msg.messagetype === 'Servermessage') {
              this.createEndMessage(message.msg);
            }
            if(message.msg.sender !== 'Ich') {
              this.createBotMessageToDisplay(message.msg);
              this.getNextMessage(userID);
            }

          } else if(message.answertype === 'AnswerList') {
            this.setAnswers(message.msg);
          }
        });*/
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
      const image = nodeMessage.message.substr(2);
      this.messages.push({
        type: 'file',
        reply: false,
        files: [ { url: '/assets' + image, type: 'image/jpg' }],
        user: {
          name: nodeMessage.sender,
        }
      });
      this.storyService.localSaveOfMessages(nodeMessage);
    } else if (nodeMessage.messagetype === 'Video') {
      const video = nodeMessage.message.substr(2);
      this.messages.push({
        type: 'file',
        reply: false,
        files: [ { url: '/assets' + video, type: 'video/mp4' }],
        user: {
          name: nodeMessage.sender,
        }
      });
      this.storyService.localSaveOfMessages(nodeMessage);
    } else if (nodeMessage.messagetype === 'Voice') {
      const voice = nodeMessage.message.substr(2);
      this.messages.push({
        type: 'file',
        reply: false,
        files: [ { url: '/assets' + voice, type: 'audio/mp3' }],
        user: {
          name: nodeMessage.sender,
        }
      });
      this.storyService.localSaveOfMessages(nodeMessage);
    }
    if(this.messages.length === 1) {
      this.checkForStoryTitle();
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
    if(this.messages.length === 1) {
      this.checkForStoryTitle();
    }
    this.storyService.localSaveOfMessages(answer);
  }

  /**
   * Wenn der Server eine Servermessage schickt, ist das Spiel beendet.
   * @param nodeMessage
   */
  createEndMessage(nodeMessage: NodeMessage) {
    this.messages.push({
      text: nodeMessage.message,
      reply: false,
      user: {
        name: nodeMessage.sender,
      }
    });
  }

  /**
   * Wenn alle Nachrichten einer Node erhalten wurden, werden die Antworten geschickt.
   * Sobald dies geschieht erhält der Nutzer die Möglichkeit, aus diesen auszuwählen und zu antworten.
   * Wenn die Liste nur die Größe 1 hat handelt es sich um das erneute Laden des Chats. Die Antwort wurde bereits gegeben und wird nun angezeigt.
   */
  setAnswers(possibilities: Answer[]) {
    this.selectableAnswers = [];
    this.storyService.saveLastAnswerPossibilities(possibilities);
    if(possibilities.length > 1) {
      this.selectableAnswers = possibilities;
    } else {
      console.log(possibilities[0]);
      this.createUserMessageToDisplay(possibilities[0]);
      console.log(possibilities[0].answerMessage + 'possibilities' );
      this.getNextMessage(Number(sessionStorage.getItem('username')));
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
            this.selectableAnswers = [];
            this.selectedAnswer = '';
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
    this.storyService.resetAllLocalMessages();
    console.log('ALLLLLL ' + this.storyService.getAllLocalMessages());
    if(allMessages.length > 0) {
      allMessages.forEach(element => {
        console.log(element.messagetype);
        if(element.messagetype != null) {
          console.log('NODEMESSAGE');
          this.createBotMessageToDisplay(element);
        } else if(element.answerMessage) {
          console.log('ANSWER');
          this.createUserMessageToDisplay(element);
        }
      });
      if(this.storyService.getLastAnswerPossibilities().length > 1) {
        this.setAnswers(this.storyService.getLastAnswerPossibilities());
      }
      this.getNextMessage(Number(sessionStorage.getItem('userID')));
    }
  }

  checkForStoryTitle() {
   /* if(this.messages[0] !== null) {
      if(this.messages[0].user.name === 'Kommissar Thomas') {
        this.storyTitle = 'Mord in der Zukunft';
      } else if(this.messages[0].user.name === 'Ich') {
        this.storyTitle = 'Der verlorene Schatz';
      }
    }*/

    console.log(this.storyTitle);
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
