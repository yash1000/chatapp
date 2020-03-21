import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appinfo } from '../../environments/environment';
@Injectable()
export class ApiCalls {
  readonly baseurl = 'http://localhost:8000/';
  constructor(private https: HttpClient) {}
  // @param emp will send all form values as object
  login(emp: any) {
    return this.https.post(this.baseurl + appinfo.info.login, emp);
  }
  registration(emp: any) {
    return this.https.post(this.baseurl + appinfo.info.registration, emp);
  }
  getallusers() {
    return this.https.get(this.baseurl + appinfo.info.allusers);
  }
}
