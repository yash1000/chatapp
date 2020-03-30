import { Component, OnInit } from '@angular/core';
import { ApiCalls } from '../services/apicalls.service';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  localdata: any;
  objectofid: { id: any; };
  datas = [];

  constructor( private api: ApiCalls) { }

  ngOnInit() {
    const socket = io('http://localhost:8000');
    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    socket.emit('startconnnection', { connencted: this.localdata.uid });

    socket.on('newfriend', data => {
      console.log(data);
      this.datas.push(data);
    });

    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    console.log(this.localdata.uid);
    this.objectofid = {
      id: this.localdata.uid
    };
    this.api.getfriends(this.objectofid).subscribe((res: any) => {
      console.log(res);
      for(let i=0;i<res.length;i++){
      this.datas.push(res[i]);
    }
    });
    // console.log(this.datas)
  }
}
