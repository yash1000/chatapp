import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  profileForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.profileForm = this.fb.group({
      image: ['', Validators.required],
    });

    // File-1587731233394.mp4
  }
  // tslint:disable-next-line:member-ordering
  selectedFile: File = null;
  // tslint:disable-next-line:member-ordering
  fd = new FormData();
  createFormData(event) {
  // tslint:disable-next-line:no-angle-bracket-type-assertion
  this.selectedFile = <File> event.target.files[0];
  }
  onSubmit(e) {
    console.log(this.profileForm);
  }
}
