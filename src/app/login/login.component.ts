import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from './custom-validators';
// declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  profileForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // $('.js-tilt').tilt({
    //   scale: 1.1
    // });
    this.profileForm = this.fb.group({
      Emailid: ['', [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.compose([
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
            CustomValidators.patternValidator(/[!@#\$%\^&]/, {
              haslengthCase: true
            }),
            ,
          ]),
          Validators.minLength(8)
        ]
      ]
    });
  }
  onSubmit(event) {
    console.log(this.profileForm.value);
  }
}













