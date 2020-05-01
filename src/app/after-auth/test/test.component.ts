import { Component, OnInit , ViewChild } from '@angular/core';
declare var SimplePeer: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  @ViewChild('myvideo', {static: true}) myvideo: any;

  constructor() { }
  targetpeer: any;
  n =  navigator as any;
  peer: any;
  ngOnInit() {
    const video = this.myvideo.nativeElement;
    let peerx: any;
    this.n.getUserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia);
    this.n.getUserMedia({video: true, audio: true}, (stream) => {

    peerx = new SimplePeer({
      initiator: location.hash === '#init',
      trickle: false,
      stream,
    });
    peerx.on('signal', (data) => {
      console.log(JSON.stringify(data));
      this.targetpeer = data;
    });
    peerx.on('data',  (data) => {
      console.log('recive message');
      console.log(data);
    });
    peerx.on('stream', (streams) => {
      video.srcObject = streams;
      video.play();
    });
  }, (err) => {
    console.log(err);
  });

    setTimeout(() => {
    this.peer = peerx;
    console.log(this.peer);
  }, 5000);
  }
  connect() {
    this.peer.signal(JSON.parse(this.targetpeer));
  }
  message() {
    this.peer.send('hello');
  }

}
