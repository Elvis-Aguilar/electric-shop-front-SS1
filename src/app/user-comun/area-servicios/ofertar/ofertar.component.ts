import { Component, Input, inject } from '@angular/core';
import { Servicio } from '../../../core/models/servicios/servicio';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ServicioService } from '../../../core/services/servicios/servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ofertar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ofertar.component.html',
  styleUrl: './ofertar.component.css'
})
export class OfertarComponent {

  @Input('id') productoId!: string;

  servicio!: Servicio

  registerForm!: FormGroup;

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly servicioService = inject(ServicioService)


  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    const param = this.productoId.split('-')[0]
    const id = parseInt(param, 10)
    this.servicioService.getServicioId(id).subscribe(
      (result) => {
        this.servicio = result
        this.initRegisterFrom()
      }
    )
  }

  initRegisterFrom() {
    const idSoliciatne = this.authService.getUsuarioSesion()?.id || 0
    const idUser = this.servicio.usuario_publicador
    this.registerForm = this.formBuilder.group({
      estado: [1, Validators.required],
      usuario_ofertante_id: [idSoliciatne, Validators.required],
      usuario_propietario_id: [idUser, Validators.required],
      servicio_id: [this.servicio.servicio_id, Validators.required],
      moneda_ms: [null, Validators.required],
      moneda_local: [null, Validators.required],
      descripcion: [null, Validators.required]
    })
  }


  register() {
    this.servicioService.saveOferta(this.registerForm.value).subscribe({
      next: value =>{
        this.msgSucces()
        this.router.navigate(['area-servicios/home'])
      },
      error: err =>{
        this.msgError()
      }
    })

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
      'Proceso exitoso',
      'Su oferta de servicio ha sido enviado con exito',
      'success'
    );
  }

}
