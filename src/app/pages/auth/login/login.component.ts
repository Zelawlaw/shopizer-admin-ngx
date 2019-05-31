import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.createForm();
  }

  ngOnInit() {
    document.getElementsByTagName('body')[0].className += ' nb-theme-corporate';
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.errorMessage = '';
    const formData = this.form.value;

    this.authService.logon(formData.username, formData.password)
      .subscribe(res => {
        this.tokenService.saveToken(res.token);
        this.router.navigate([ 'pages' ]);
      }, err => {
        this.errorMessage = 'Invalid username or password';
      });
  }

  private createForm() {
    this.form = this.fb.group({
      username: [ '', [ Validators.required ] ],
      password: [ '', Validators.required ]
    });
  }

}
