import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm!: FormGroup;
  file!: File
  formData!: FormData

  constructor(private formBuilder: FormBuilder) {
    this.initRegisterFrom()
  }


  initRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      nombre: [null, Validators.required],
      username: [null, Validators.required],
      password: [null, Validators.required],
      foto: [null, Validators.required],
      correo: [''],
      face: [''],
      insta: [''],
      linkedin: [''],
      telegram: [''],
      tel: ['']
    })
  }

  register() {
    //this.registerForm.value.foto = this.formData
    this.registerForm.value.password = CryptoJS.SHA256(this.registerForm.value.password).toString();
    console.log(this.registerForm.value);

  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement != null && inputElement.files != null && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      this.formData = new FormData();
      this.formData.append('imagen', this.file, this.file.name);
    }
  }
}
