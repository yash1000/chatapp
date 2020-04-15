import { Component, OnInit } from '@angular/core';
import { ApiCalls } from '../../services/apicalls.service';
import * as io from 'socket.io-client';
declare const $: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  localdata: any;
  objectofid: any;
  datas = [];
  onlineusers: any;
  chatname: any;
  room: any;
  messagesendid: any;
  newmessagearray = [];
  chatroom = [];
  currentroom: any;
  typing: any;
  img: any;

  constructor(private api: ApiCalls) {}

  ngOnInit() {
    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    console.log(this.localdata.uid);
    this.objectofid = {
      id: this.localdata.uid,
    };
    this.api.getfriends(this.objectofid).subscribe((res: any) => {
      console.log(res);
      // tslint:disable-next-line:quotemark
      if (res === "sorry you don't have friends") {
        console.log(this.datas);
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res.length; i++) {
          this.datas.push(res[i]);
        }
      }
    });
    console.log(this.datas);
    const socket = io('http://localhost:8000');
    socket.emit('startconnnection', { connencted: this.localdata.uid });
    socket.on('online users', (data) => {
      console.log(data.online);
      console.log(data.online.length);
      const a = data.online.length;
      this.onlineusers = data.online;
    });
    socket.on('new data', (datas) => {
      console.log(datas);
    });
    socket.on('chat message', (data) => {
      console.log(data);
    });

    socket.on('totyping', (data) => {
      this.typing = data;
    });
    socket.on('stoptyping', (data) => {
      this.typing = data;
    });
  }
  changecomponent(id, name, image) {
    const socket = io('http://localhost:8000');
    this.messagesendid = id;
    this.chatname = name;
    this.img = image;
    const a = this.localdata.uid + id;
    const b = id + this.localdata.uid;
    const c = this.chatroom.includes(a);
    const d = this.chatroom.includes(b);
    if (this.chatroom.includes(a) || this.chatroom.includes(b)) {
      if (c === true) {
        console.log(`room is ${a}`);
        this.currentroom = a;
      } else {
        console.log(`room is ${b}`);
        this.currentroom = b;
      }
      console.log('already includes');
    } else {
      socket.emit('new', { me: this.localdata.uid, to: id });
      socket.on('room is', (data) => {
        const obj = {
          room: data,
        };
        this.api.getmessages(obj).subscribe((res: any) => {
          console.log(res);
          for (const message of res) {
            this.newmessagearray.push(message);
          }
        });
      });
    }
    socket.on('room is', (data) => {
      this.chatroom.push(data);
      this.currentroom = data;
      console.log(this.currentroom);
    });

    socket.on('welcome message', (data) => {
      // console.log(data);
      this.newmessagearray.push(data);
    });
  }

  messagesend(text) {
    if (text.value === '' || text.value === null) {
    } else {
      const date = new Date(Date.now());
      const d = new Date();
      const h = d.getHours();
      const m = d.getMinutes();
      const s = d.getSeconds();
      const socket = io('http://localhost:8000');
      socket.emit('new', { me: this.localdata.uid, to: this.messagesendid });
      socket.on('room is', (data) => {
        // console.log(data);
        socket.emit(data, {
          room: data,
          message: text.value,
          sendbyuid: this.localdata.uid,
          sendby: this.localdata.displayName,
          internationaldate: date.toString(),
          date: `${h}:${m}:${s}`,
          to: this.messagesendid,
        });
      });
    }
  }
  myFunction(e) {
    const socket = io('http://localhost:8000');
    if (e.value !== '') {
      socket.emit('typing', { me: this.localdata.uid, to: this.messagesendid });
    } else {
      socket.emit('stop typing', {
        me: this.localdata.uid,
        to: this.messagesendid,
      });
    }
  }
}
