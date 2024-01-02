import WidgetAPI from "./WidgetAPI";
import Message from "./Message";

export default class Widget {
  constructor(element) {
    this.element = element;
    this.api = new WidgetAPI("https://rxjs-backend-4kog.onrender.com/messages/unread");
    this.messages = [];
  }

  bindToDOM() {
    this.list = this.element.querySelector('.messages');
  }

  init() {
    this.bindToDOM();

    this.messages$ = this.api.init();

    this.visibleMessagesCount = 10;

    const newMessages = new Set();

    this.messages$.subscribe((messages) => {
      const messagesArr = messages.reduce((acc, message) => {
        if (newMessages.has(message.id)) {
          return acc;
        }

        newMessages.add(message.id);
        acc.push(message);
        return acc;
      }, []);

      for (const message of messagesArr) {
        const newMessage = new Message(this.list, message);
        newMessage.create();
      }

      if (this.areAllMessagesVisible === true) {
        return;
      }

      const result = [...Array(this.visibleMessagesCount).keys()];

      Array.from(this.list.querySelectorAll('.message')).forEach((messageElement) => {
        if (result.includes(Array.from(this.list.querySelectorAll('.message')).indexOf(messageElement)) === false) {
          messageElement.remove();
        }
      });

      if (messages.length > 10) {
        this.createLoadMoreBtn(messages);
        this.list.classList.add('messages_load-more');
      }
    });
  }

  createLoadMoreBtn(messages) {
    if (this.element.querySelector('.messages__load-more')) {
      this.element.querySelector('.messages__load-more').remove();
      this.list.classList.remove('messages_load-more');
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('messages__load-more');
    button.textContent = 'Load more';

    this.element.append(button);

    button.addEventListener('click', () => {
      const visibleMessagesCount = this.visibleMessagesCount;
      this.visibleMessagesCount = visibleMessagesCount + 10;

      Array.from(this.list.querySelectorAll('.message')).forEach((messageElement) => {
        messageElement.remove();
      })

      const messagesKeys = Array.from(Array(messages.length).keys());
      const visibleMessagesKeys = messagesKeys.filter((val, index, arr) => index > arr.length - this.visibleMessagesCount - 1);

      for (const message of messages) {
        if (visibleMessagesKeys.includes(messages.indexOf(message))) {
          const newMessage = new Message(this.list, message);
          newMessage.create();
        }
      }

      if (messages.length === Array.from(this.list.querySelectorAll('.message')).length) {
        this.areAllMessagesVisible = true;
        button.remove();
        this.list.classList.remove('messages_load-more');
      }
    })
  }
}
