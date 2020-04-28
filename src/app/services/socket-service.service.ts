import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {
  socket = io('http://localhost:8000');
  constructor() { }
}
