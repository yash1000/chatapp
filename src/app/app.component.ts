import { Component, OnInit } from '@angular/core';
// import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
//   title = 'chatapp';
// constructor(private websocketservice: WebsocketService) {
// }
  ngOnInit() {
// this.websocketservice.listen().subscribe((data)=>{
//   console.log(data);
// });
  }
}
