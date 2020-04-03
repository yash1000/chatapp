import { Component, OnInit, AfterContentChecked, AfterContentInit, AfterViewInit, OnChanges } from '@angular/core';
import { ApiCalls } from '../../services/apicalls.service';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  data: any;
  localdata: any;
  uid: any;
  newrequest: any;
  datas: any;
  accept: any;
  newdata: any;
  constructor(private api: ApiCalls, private ngxService: NgxUiLoaderService) {}


  ngOnInit() {
    // this.ngxService.start();
    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    this.uid = {uid: this.localdata.uid };
    const local = JSON.parse(localStorage.getItem('accessToken'));

    this.api.getallusers(this.uid).subscribe((data: any) => {
      console.log(data);
      const getname = data.findIndex(data => data.id === local.uid);
      data.splice(getname, 1);
      this.data = data;
      console.log(this.data);
    });
    this.api.getrequestlist(this.uid).subscribe((data: any) => {
      console.log(data);
      this.newdata = data;
      for (const [i, v] of this.newdata.entries()) {
        setTimeout(() => {
          $(`#abc` + v).prop('disabled', true);
     }, 1000);
      }
   });
    const socket = io('http://localhost:8000');
    socket.emit('startconnnection', { connencted: this.localdata.uid });
    socket.on('newbutton', data => {
    console.log(data);
    $(`#abc${data}`).prop('disabled', false);
    console.log(`${data}`);
    });
  }

  requestsend(id) {
    // const socket = io('http://localhost:8000/request');
    // console.log(id);
    // socket.emit('chat', {
    //   to: id,
    //   from: this.uid,
    //   message: 'friend request'
    // });
    const socket = io('http://localhost:8000');
    // socket.emit('startconnnection', { connencted: this.localdata.uid });
    socket.emit('request', {
      to: id,
      from: this.uid.uid,
      message: 'friend request'
    });
    socket.on('accept message', data => {
      console.log(data);
      this.datas = data;
    });
    // socket.on('buttondisable', data => {
    //   console.log(data);
    //   this.accept = data;
    $(`#abc${id}`).prop('disabled', true);
    console.log(`${id}`);
    // });

    console.log(id);
    // console.log(this.localdata);
    // this.newrequest = {
    //   from: this.localdata.uid,
    //   to: id,
    //   status: 1,
    // };
    // this.api.sendrequest(this.newrequest).subscribe((data) => {
    //   console.log(data);
    // });
  }
}
