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
  room: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    console.log(this.localdata.uid);
    this.displayname = this.localdata.displayName;
    this.uid = this.localdata.uid;
//     const socket = io('http://localhost:8000');
//     socket.emit('startconnnection', { connencted: this.localdata.uid });
//     // socket.to('room1').emit('event', 'helo');
//     socket.on('online users', data => {
//       console.log(data.online);
//       this.datas = data.online;
//     });
//     socket.on('hello', data => {
//       console.log(data);
//       this.message.push(data);
//       // this.message = data;
//     });
//     socket.on('accept message', data => {
//       console.log(data);
//       this.datas = data;
//     });

//     if ( this.uid === 'e7Zlrf7gxZuZOLdGw4mi' || this.uid === 'wgX6pG4uILKpSLWzpRmG') {
//       this.room = 'room1';
//     } else {
//       this.room = 'room2';
//     }

//     socket.emit('create', this.room);
//     // socket.on('chat message', (data) => {
//     //   console.log(data);
//     //   socket.emit('room1', `hello i m ${this.localdata.uid}`);
//     socket.on('new data', (datas) => {console.log(datas); });
//     // });

//     // chat.on('connect',  () => {


// //     const room = 'abc123';

// //     socket.on('connect', () => {
// //    // Connected, let's sign-up for to receive messages for this room
// //    socket.emit('room', room);
// // });

// //     socket.on('message', (data) => {
// //    console.log('Incoming message:', data);
// // });




  }

//   socket(input) {
//     // console.log(input.value);
//     // const socket = io('http://localhost:8000');
//     // socket.emit('my other event', { my: input.value, to: 'yashsanja13644@gmail.com' });
//     // socket.on('first',  (data) => {
//     //   console.log(data);
//     //   this.data = data.server;
//     // });

//     console.log(this.datas);
//     const socket = io('http://localhost:8000');
//     // chat.on('connect',  () => {
//     socket.emit('chat', {
//       to: 'vf2K4mC9ebVWTkpXth5zFvbkTmx2',
//       from: this.uid,
//       message: input.value
//     });
//     // });
//     // chat.on('a message', (data) => {
//     //   console.log(data);
//     // });
//     // console.log('asd')
//   }
  ondashboard() {
    console.log('d');
    // this.router.navigate(['/header']);
    // this.router.navigate(['/dashboard']);
    this.router.navigate(['/chat']);
  }
  onusers() {
    this.router.navigate(['/users']);
  }
//   chat(id, input) {
//     const socket = io('http://localhost:8000');


//     console.log(id);
//     // socket.on('chat message', (data) => {
//       // console.log(data);



//     // socket.emit('create', this.room);
//     // socket.on('chat message', (data) => {
//     //   console.log(data);
//     //   socket.emit('room1', `hello i m ${this.localdata.uid}`);
//     //   socket.on('new data', (datas) => {console.log(datas); });
//     // });


//     console.log(this.room);
//     socket.emit('create', this.room);
//     socket.on('chat message', (data) => {
//     socket.emit(this.room, {
//         from: this.uid,
//         message: input.value
//       });
//     // socket.on('new data', (datas) => {console.log(datas.message); });
//       // socket.emit('room1', );
//     });
//     // chat.on('connect',  () => {
//        // set-up a connection between the client and the server

// // let's assume that the client page, once rendered, knows what room it wants to join
// //     socket.emit('chat', {
// //   to: id,
// //   from: this.uid,
// //   message: input.value
// // });
//   }
  onrequest() {
    this.router.navigate(['/request']);
  }
  friends() {
    this.router.navigate(['/friends']);
  }
}
