import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EventoService } from '../../../core/services/evento/evento.service';
import { TipoEvento } from '../../../core/models/evento/tipo-evento';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-public-evento',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-public-evento.component.html',
  styleUrl: './form-public-evento.component.css'
})
export class FormPublicEventoComponent {

  registerForm!: FormGroup;
  file!: File
  formData!: FormData

  private readonly eventoService = inject(EventoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  tipoEventos: TipoEvento[] = []

  constructor(private formBuilder: FormBuilder) {
    this.getTipoEventos()
    this.initRegisterFrom()
  }

  initRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      nombre: [null, Validators.required],
      usuario_publicador: '',
      descripcion: [null, Validators.required],
      permite_contactar: true,
      es_voluntariado: true,
      remunerar_moneda_local: 0,
      remunerar_moneda_sitema: 0,
      max_participantes: 0,
      lugar_realizacion: [null, Validators.required],
      url_foto: [null, Validators.required],
      fecha_realizacion: [null, Validators.required],
      tipo_evento: 'Todos'
    })
  }

  register() {
    if (this.validarInfo()) {
      this.eventoService.saveImgEvento(this.formData).subscribe({
        next: value => {
          this.registerForm.value.url_foto = value.url_foto;
          this.registerEvento();
        },
        error: err => console.error('Observable emitted an error: ' + err),
      })
    }
  }

  registerEvento() {
    this.eventoService.saveEvento(this.registerForm.value).subscribe({
      next: value => {
        this.msgSucces();
        this.router.navigate(['personal/eventos-registrados'])
      },
      error: err => {
        console.error('Observable emitted an error: ' + err)
        this.msgError();
      }
    })
  }

  validarInfo(): boolean {
    if (!this.registerForm.value.es_voluntariado) {
      if (this.registerForm.value.remunerar_moneda_local <= 0 || this.registerForm.value.remunerar_moneda_sitema <= 0) {
        Swal.fire(
          'Datos Incorrectos!',
          'El valor de remuneracion debe ser mayor a 0',
          'info'
        );
        return false
      }
    } else {
      this.registerForm.value.remunerar_moneda_local = 0
      this.registerForm.value.remunerar_moneda_sitema = 0
    }
    this.registerForm.value.es_voluntariado = this.registerForm.value.es_voluntariado ? 1 : 0
    if (this.registerForm.value.max_participantes < 0) {
      Swal.fire(
        'Datos Incorrectos!',
        'El valor de  participantes maximos  no puede ser menor a 0',
        'info'
      );
      return false
    }

    if (this.registerForm.value.tipo_evento === 'Todos') {
      this.registerForm.value.tipo_evento = this.tipoEventos.find(tipo => tipo.alias === this.registerForm.value.tipo_evento)?.tipo_even_id
    } else {
      this.registerForm.value.tipo_evento = parseInt(this.registerForm.value.tipo_evento)
    }
    this.registerForm.value.usuario_publicador = this.authService.getUsuarioSesion()?.id
    this.registerForm.value.permite_contactar = this.registerForm.value.permite_contactar ? 1 : 0

    return true;
  }

  getTipoEventos() {
    this.eventoService.getTipoEvento().subscribe({
      next: value => this.tipoEventos = value,
      error: err => console.error('Observable emitted an error: ' + err),
    })
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement != null && inputElement.files != null && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      this.formData = new FormData();
      this.formData.append('imagen', this.file, this.file.name);
    }
  }

  msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

  msgSucces() {
    Swal.fire(
      'Registro Exitoso',
      'Su registro al sistema ha sido exitoso, Debe esperar que el Administrador autorize su Publicacion',
      'success'
    );
  }

}
