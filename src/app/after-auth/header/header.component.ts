import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  localdata: any;
  displayname: any;
  uid: any;

  constructor() { }

  ngOnInit() {
    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    console.log(this.localdata.uid);
    this.displayname = this.localdata.displayName;
    this.uid = this.localdata.uid;
  }
  openNav() {
    document.getElementById('mySidenav').style.width = '250px';
  }
  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
  }
}
