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
  selectedItem = '2';

  selectedStory: string;
  selectedStoryNumber: number;
  test: string[] = ['a', 'ab'];
  botName = '';
  userName = 'NUTZERNAMEN ANZEIGEN';
  answers: Answer[] = [];
  inputField: any;

  selectableAnswers: Answer[];
  selectedAnswer: string;

  messages: any[] = [];

  constructor(private route: ActivatedRoute, private storyService: StoryService) {
  }

  ngOnInit() {
    this.selectedStory = this.route.snapshot.paramMap.get('selectedStory');
    if (this.selectedStory === StringConstants.MURDER_STORY) {
      this.selectedStoryNumber = 0;
      this.botName = 'Bot Murder';
    } else if (this.selectedStory === StringConstants.TREASURE_STORY) {
      this.selectedStoryNumber = 1;
      this.botName = 'Bot Treasure';
    }

    this.messages.push({
        text: 'Drag & drop a file or a group of files.',
        reply: false,
        user: {
          name: this.botName,
          avatar: 'https://i.gifer.com/no.gif',
        },
      },
    );
    this.showAnswers();
    this.setPositionOfSelection();
    /* this.storyService.setSelectedStory(this.selectedStoryNumber).subscribe(
       data => {
         this.getNextMessageFromQueue();
       }
     );*/
  }

  setPositionOfSelection() {
    const x = document.getElementsByTagName('input');
    this.inputField = x[0].getBoundingClientRect();
    const selection = document.getElementById('selection');
    console.log(this.inputField.offsetTop);
    selection.style.position = 'absolute';
    selection.style.left = this.inputField.left + 'px';
    selection.style.top = 0+'px';
  }

  /**
   * Fragt so lange nach neuen Nachrichten, bis Antwortmöglichkeiten mitgeliefert werden.
   */
  getNextMessageFromQueue() {
    while (this.answers.length <= 1) {
      let messageObject: MessageObject;
      this.storyService.getNextMessageFromQueue().subscribe(data => {
        messageObject = data;
        this.createBotMessageToDisplay(messageObject.nodeMessage);
        if (messageObject.answers != null) {
          this.answers = messageObject.answers;
          this.showAnswers();
        }
      });
    }
  }

  sendMessage(event) {
    this.messages.push({
      text: event.message,
      // date: new Date(),
      reply: true,
      user: {
        name: 'Jonh Doe',
        avatar: 'https://techcrunch.com/wp-content/uploads/2015/08/safe_image.gif',
      },
    });

    const botMessage = {
      text: 'Antwort',
      date: new Date(),
      reply: false,
      user: {
        name: 'Bot',
        avatar: 'https://i.gifer.com/no.gif',
      },
    };
    setTimeout(() => {
      this.messages.push(botMessage);
    }, 500);
  }

  /**
   * NodeMessages sind nicht kompatibel mit Nachrichten, die der Chat anzeigen kann.
   * Eine NodeMessage wird in eine message umgewandelt.
   * @param nodeMessage
   * Die umzuwandelnde Nachricht.
   */
  createBotMessageToDisplay(nodeMessage: NodeMessage) {
    if (nodeMessage.type === MessageType.Text) {
      this.messages.push({
        text: nodeMessage.message,
        reply: false,
        user: {
          name: this.botName,
        }
      });
    } else if (nodeMessage.type === MessageType.Image) {
      this.messages.push({
        text: nodeMessage.message,
        reply: false,
        user: {
          name: this.botName,
        }
      });
    } else if (nodeMessage.type === MessageType.Video) {
      this.messages.push({
        text: nodeMessage.message,
        reply: false,
        user: {
          name: this.botName,
        }
      });
    } else if (nodeMessage.type === MessageType.Voice) {
      this.messages.push({
        text: nodeMessage.message,
        reply: false,
        user: {
          name: this.botName,
        }
      });
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
        name: sessionStorage.getItem('email'),
      },
    });
  }

  /**
   * Wenn alle Nachrichten einer Node erhalten wurden, werden die Antworten geschickt.
   * Sobald dies geschieht erhält der Nutzer die Möglichkeit, aus diesen auszuwählen und zu antworten.
   */
  showAnswers() {
    const answer = new Answer();
    answer.answerMessage = 'hallo';
    answer.answerIdCounter = 1;
    answer.answerID = 2;
    answer.answerNode = null;

    const answer2 = new Answer();
    answer2.answerMessage = 'wie';
    answer2.answerIdCounter = 2;
    answer2.answerID = 2;
    answer2.answerNode = null;

    const answer3 = new Answer();
    answer3.answerMessage = 'gehts';
    answer3.answerIdCounter = 3;
    answer3.answerID = 2;
    answer3.answerNode = null;

    this.selectableAnswers = [];
    this.selectableAnswers.push(answer);
    this.selectableAnswers.push(answer2);
    this.selectableAnswers.push(answer3);
  }

  sendAnswers() {
    this.selectableAnswers.forEach(answer => {
      if (answer.answerMessage === this.selectedAnswer) {
        console.log('Treffer');
        console.log(answer.answerID);
        this.createUserMessageToDisplay(answer);
        /*this.storyService.sendRepsonseToServer(this.selectedAnswer.answerID).subscribe(
          data => {
            this.answers = [];
            this.selectedAnswer = null;
            this.getNextMessageFromQueue();
          }
        );*/

      }
    });
    /*this.storyService.sendRepsonseToServer(this.selectedAnswer.answerID).subscribe(
      data => {
        this.answers = [];
        this.selectedAnswer = null;
        this.getNextMessageFromQueue();
      }
    );*/
  }


  /**
   * Holt alle Nachrichten, die lokal gespeichert werden. Beispielsweise beim Aufruf der Seite.
   * Wird nur relevant, wenn der Nutzer schon im Spiel ist.
   */
  setAllMessagesBasedOnLocalStorage() {
    this.messages = [];
    let allMessages = this.storyService.getAllLocalMessages();
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
}
