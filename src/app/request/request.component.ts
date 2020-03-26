import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ApiCalls } from '../services/apicalls.service';
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  localdata: any;
  objectofid: any;
  datas = [];
  constructor(private api: ApiCalls) { }

  ngOnInit() {
    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    console.log(this.localdata.uid);
    // const socket = io('http://localhost:8000');
    // socket.emit('startconnnection', { connencted: this.localdata.uid });
    // const sockets = io('http://localhost:8000/request');
    // sockets.on('friend request', data => {
    //   console.log(data);
    // });
    console.log(this.datas);
    this.objectofid = {
      id: this.localdata.uid,
    };
    this.api.getrequests(this.objectofid).subscribe((data: any) => {
      // console.log(data);
      for (let i = 0 ; i < data.length; i++) {
      this.datas.push(data[i]);
      console.log(data);
      // console.log(this.datas);
    }
    });
    const socket = io('http://localhost:8000');


    socket.emit('startconnnection', { connencted: this.localdata.uid });

    socket.on('accept message', data => {
      console.log(data);
      this.datas.push(data);
    });

  }
  acceptfriendrequest(id) {
console.log(id);
  }
}
