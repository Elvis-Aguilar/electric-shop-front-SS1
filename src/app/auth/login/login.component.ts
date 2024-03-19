import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.initLoginFrom()
  }


  initLoginFrom() {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  goResigster() {
    this.router.navigate(['auth/register']);
  }

  logger(){
    //@dminP4ss/*-
    this.loginForm.value.password = CryptoJS.SHA256(this.loginForm.value.password).toString();
    console.log(this.loginForm.value)
  }
}
