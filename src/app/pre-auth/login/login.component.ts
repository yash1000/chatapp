import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../../services/custom-validators';
import { ApiCalls } from '../../services/apicalls.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  profileForm: FormGroup;
  new: any;
  constructor(private fb: FormBuilder, private api: ApiCalls, private routes: Router) { }

  ngOnInit() {

    /**
     * form init
     */
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

  /**
   * subbmite form funcion with api call and db
   */
  onSubmit(event) {
    console.log(this.profileForm.value);
    this.api.login(this.profileForm.value).subscribe((res: any) => {
      if (res.message === 'there is no user like this') {
        console.log('sorry there is no user like this');
      } else {
      console.log(res);

      localStorage.setItem('accessToken', JSON.stringify(res));
      this.routes.navigate(['/dashboard']);
      }
    });
  }
  onregistration() {
    this.routes.navigate(['/registration']);
  }
}