// import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
// import { Observable, Subscriber } from 'rxjs';
// import { eventNames } from 'cluster';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService {

//   constructor( ) {
//     this.socket = io(this.url);
//    }
//   socket: any;
//   url: any = 'ws://localhost:8000';
//   listen() {
// return new Observable((subscribe) => {
//   this.socket.on(eventNames,(data) => {
//     subscribe.next(data);
//   });
// });
//   }
//   emit( eventNames : String, data: any){
//     this.socket.emit(eventNames, data );
//   }
// }
