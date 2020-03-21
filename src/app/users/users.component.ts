import { Component, OnInit } from '@angular/core';
import { ApiCalls } from '../services/apicalls.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  data: any ;

  constructor(private api: ApiCalls) { }

  ngOnInit() {
    const local = JSON.parse(localStorage.getItem('accessToken'));
    this.api.getallusers()
    .subscribe((data: any) => {
      // tslint:disable-next-line: no-shadowed-variable
      const getname = data.findIndex(data => data.id === local.uid);
      data.splice(getname, 1);
      this.data = data;
    });
  }
}
