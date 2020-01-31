import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChatElementComponent} from './chat-element/chat-element.component';
import {StringConstants} from '../../constants/string-constants';
import {StoryService} from '../../services/story.service';
import {NodeMessage} from '../../models/node.message';
import {Answer} from '../../models/answer';
import {MessageObject} from '../../models/message.object';
import {MessageType} from '../../models/message.type';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  selectedStory: string;
  selectedStoryNumber: number;
  test: string[] = ['a', 'ab'];
  botName = 'BOTNAME';
  userName = 'NUTZERNAMEN ANZEIGEN';
  answers: Answer[] = [];

  selectedAnswer: Answer;

  messages: any[] = [
    {
      text: 'Drag & drop a file or a group of files.',
      date: new Date(),
      reply: false,
      user: {
        name: 'Bot',
        avatar: 'https://i.gifer.com/no.gif',
      },
    },
  ];

  constructor(private route: ActivatedRoute, private storyService: StoryService) {
  }

  ngOnInit() {
    this.selectedStory = this.route.snapshot.paramMap.get('selectedStory');
    if (this.selectedStory === StringConstants.MURDER_STORY) {
      this.selectedStoryNumber = 0;
    } else if (this.selectedStory === StringConstants.TREASURE_STORY) {
      this.selectedStoryNumber = 1;
    }
    this.storyService.setSelectedStory(this.selectedStoryNumber).subscribe(
      data => {
        this.getNextMessageFromQueue();
      }
    );
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
   * Eine NodeMessage wird in eine messgae umgewandelt.
   * @param nodeMessage
   * Die umzuwandelnde Nachricht.
   */
  createBotMessageToDisplay(nodeMessage: NodeMessage) {
    if(nodeMessage.type === MessageType.Text) {
      this.messages.push({
        text: nodeMessage.message,
        reply: false,
        user: {
          name: this.botName,
        }
      });
    }
    else if(nodeMessage.type === MessageType.Image) {
      this.messages.push({
        text: nodeMessage.message,
        reply: false,
        user: {
          name: this.botName,
        }
      });
    }
    else if(nodeMessage.type === MessageType.Video) {
      this.messages.push({
        text: nodeMessage.message,
        reply: false,
        user: {
          name: this.botName,
        }
      });
    }
    else if(nodeMessage.type === MessageType.Voice) {
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
   * Wenn alle Nachrichten einer Node erhalten wurden, werden die Antworten geschickt.
   * Sobald dies geschieht erhält der Nutzer die Möglichkeit, aus diesen auszuwählen und zu antworten.
   */
  showAnswers() {

  }

  sendAnswers(event) {
    this.storyService.sendRepsonseToServer(this.selectedAnswer.answerID).subscribe(
      data => {
        this.answers = [];
        this.selectedAnswer = null;
        this.getNextMessageFromQueue();
      }
    );
  }
}
