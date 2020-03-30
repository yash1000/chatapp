import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: any;
  localdata: any;
  datas = [];
  displayname: any;
  uid: any;
  message = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    console.log(this.localdata.uid);
    this.displayname = this.localdata.displayName;
    this.uid = this.localdata.uid;
    const socket = io('http://localhost:8000');
    socket.emit('startconnnection', { connencted: this.localdata.uid });

    socket.on('online users', data => {
      console.log(data.online);
      this.datas = data.online;
    });
    socket.on('hello', data => {
      console.log(data);
      this.message.push(data);
      // this.message = data;
    });
    socket.on('accept message', data => {
      console.log(data);
      this.datas = data;
    });

  }
  openNav() {
    document.getElementById('mySidenav').style.width = '250px';
  }
  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
  }
  socket(input) {
    // console.log(input.value);
    // const socket = io('http://localhost:8000');
    // socket.emit('my other event', { my: input.value, to: 'yashsanja13644@gmail.com' });
    // socket.on('first',  (data) => {
    //   console.log(data);
    //   this.data = data.server;
    // });
    // const chat = io.connect('http://localhost:8000/chat');
    // // const socket = io('http://localhost:8000');
    // const chat = io.connect('http://localhost:8000/chat');
    // const news = io.connect('http://localhost:8000/news');
    console.log(this.datas);
    const socket = io('http://localhost:8000');
    // chat.on('connect',  () => {
    socket.emit('chat', {
      to: 'vf2K4mC9ebVWTkpXth5zFvbkTmx2',
      from: this.uid,
      message: input.value
    });
    // });
    // chat.on('a message', (data) => {
    //   console.log(data);
    // });
    // console.log('asd')
  }
  ondashboard() {
    console.log('d');
    // this.router.navigate(['/header']);
    // this.router.navigate(['/dashboard']);
    this.router.navigate(['/chat']);
  }
  onusers() {
    this.router.navigate(['/users']);
  }
  chat(id, input) {
    console.log(id);
    console.log(input.value);
    const socket = io('http://localhost:8000');
    // chat.on('connect',  () => {
    socket.emit('chat', {
      to: id,
      from: this.uid,
      message: input.value
    });
  }
  onrequest() {
    this.router.navigate(['/request']);
  }
  friends() {
    this.router.navigate(['/friends']);
  }
}
