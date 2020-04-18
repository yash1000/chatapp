import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';
import * as $ from 'jquery';

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
  img1: string;

  constructor(private router: Router) {}

  ngOnInit() {\

    /**
     * local storage access
     */
    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    console.log(this.localdata);
    this.displayname = this.localdata.displayName;
    this.uid = this.localdata.uid;
    }
  clicks(e) {
    console.log('clicks');
    const x = document.getElementsByClassName('a');
    console.log(e);
    $(this).hide();
}
  ondashboard() {
    this.router.navigate(['/chat']);
  }
  onusers() {
    this.router.navigate(['/users']);
  }
  onrequest() {
    this.router.navigate(['/request']);
  }
  friends() {
    this.router.navigate(['/friends']);
  }
}
