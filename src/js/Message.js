export default class Message {
  constructor(list, message) {
    this.list = list;
    this.message = message;
  }

  create() {
    const li = document.createElement('li');
    li.className = 'messages__message message';

    const from = document.createElement('span');
    from.classList.add('message__from');
    from.textContent = this.message.from;

    const subject = document.createElement('span');
    subject.classList.add('message__subject');
    subject.textContent = this.message.subject.length > 15 ? `${this.message.subject.slice(0, 15)}...` : this.message.subject;

    const date = document.createElement('span');
    date.classList.add('message__date');
    const newDate = new Date(this.message.received);
    const month = newDate.getMonth() + 1;
    date.textContent = `${newDate.getHours().toString().padStart(2, '0')}:${newDate.getMinutes().toString().padStart(2, '0')} ${newDate.getDate().toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${newDate.getFullYear()}`;

    this.list.prepend(li);

    li.append(from);
    li.append(subject);
    li.append(date);
  }
}
