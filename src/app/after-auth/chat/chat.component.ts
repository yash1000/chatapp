import { Component, OnInit } from '@angular/core';
import { ApiCalls } from '../../services/apicalls.service';
import * as io from 'socket.io-client';
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
  }
  changecomponent(id, name) {
    console.log(id);
    console.log(name);
    this.chatname = name;
  }
  

}
