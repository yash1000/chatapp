import { Component, OnInit } from '@angular/core';
import { ApiCalls } from '../../services/apicalls.service';
import * as io from 'socket.io-client';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
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

  constructor( private api: ApiCalls) { }

  ngOnInit() {

    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    console.log(this.localdata.uid);
    this.objectofid = {
      id: this.localdata.uid
    };
    this.api.getfriends(this.objectofid).subscribe((res: any) => {
      console.log(res);
      // tslint:disable-next-line:quotemark
      if ( res === "sorry you don't have friends") {
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
    // socket.emit('startconnnection', { connencted: this.localdata.uid });
    socket.on('online users', data => {
      console.log(data.online);
      // this.datas = data.online;
      this.onlineusers = data.online;
    });
    // for (const [i, v] of this.datas.entries()) {
    //   for (const [j, w] of this.onlineusers.entries()) {
    //     if (w.id === v.id) {
    //       console.log(v);
    //       break;
    //     } else {
    //     }
    //   }
    // }

    // socket.emit('create', this.room);
    // socket.on('chat message', (data) => {
    //   console.log(data);
    //   socket.emit('room1', `hello i m ${this.localdata.uid}`);
    socket.on('new data', (datas) => {console.log(datas); });
    socket.on('chat message', data => {
    console.log(data);
    });
  }
  changecomponent(id, name) {
    const socket = io('http://localhost:8000');
    const date = new Date(Date.now());
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    // this.room = id + this.localdata.uid;
    // if ( this.localdata.uid  || id ) {
    //   this.room = this.localdata.uid + id;
    // } else {
    //   this.room = 'room2';
    // }
    this.messagesendid = id;
    // console.log(id);
    // console.log(name);
    this.chatname = name;
    // console.log(this.room);
    // socket.emit('create', this.room);
    // socket.on('chat message', (data) => {
    // socket.emit(this.room, {
    //     from: this.localdata.uid,
    //     // message: input.value
    //   });
    // // socket.on('new data', (datas) => {console.log(datas.message); });
    //   // socket.emit('room1', );
    // });
    socket.emit('new', { me: this.localdata.uid,
      to: id
    });
    socket.on('room is', data => {
      console.log(data);
      socket.emit(data, {
        fordatabase: this.localdata.uid,
        sendby: this.localdata.displayName,
        internationaldate: date.toString(),
        date: `${h}:${m}`,
        to: this.messagesendid,
        message: 'hello i m ' + this.localdata.displayName});
    });
    socket.on('welcome message', data => {
      console.log(data);
      this.newmessagearray.push(data);
    });
  }
  messagesend(text) {
    // console.log(Date.now());
    const date = new Date(Date.now());
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    // console.log(date.toString());
    // console.log(text.value);
    const socket = io('http://localhost:8000');
    socket.emit('new', { me: this.localdata.uid,
      to: this.messagesendid
    });
    socket.on('room is', data => {
      // console.log(data);
      socket.emit(data, {
        message: text.value,
        fordatabase: this.localdata.uid,
        sendby: this.localdata.displayName,
        internationaldate: date.toString(),
        date: `${h}:${m}`,
        to: this.messagesendid
      });
    });
  }
}

