import { Component, Input, inject } from '@angular/core';
import { Servicio } from '../../../core/models/servicios/servicio';
import { Producto } from '../../../core/models/producto/producto';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../core/services/productos/producto.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServicioService } from '../../../core/services/servicios/servicio.service';

@Component({
  selector: 'app-servicio-trueque',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './servicio-trueque.component.html',
  styleUrl: './servicio-trueque.component.css'
})
export class ServicioTruequeComponent {

  @Input('id') productoId!: string;

  servicio!: Servicio
  productos: Producto[] = []

  registerForm!: FormGroup;
  idServicio = 0
  idUserOferta = 0
  ofertaName = ''


  private readonly productoService = inject(ProductoService)
  private readonly servicioService = inject(ServicioService)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    const param1 = this.productoId.split('-')[0]
    const param2 = this.productoId.split('-')[2]
    this.ofertaName = this.productoId.split('-')[1]
    this.idServicio = parseInt(param1, 10)
    this.idUserOferta = parseInt(param2, 10)
    this.productoService.getProductosUsuario(this.authService.getUsuarioSesion()?.usuario_id || 0).subscribe({
      next: value => {
        this.productos = value
      }
    })
    this.initRegisterFrom()

  }

  initRegisterFrom() {
    const idSoliciatne = this.authService.getUsuarioSesion()?.usuario_id || 0
    this.registerForm = this.formBuilder.group({
      estado: [1, Validators.required],
      usuario_oferta_id: [this.idUserOferta, Validators.required],
      usuario_servicio_id: [idSoliciatne, Validators.required],
      servicio_intercambiar_id: [this.idServicio, Validators.required],
      producto_intercambiar_id: [null, Validators.required],
      cantidad_producto: [1, Validators.required],
    })
  }

  register() {
    this.registerForm.value.producto_intercambiar_id = parseInt(this.registerForm.value.producto_intercambiar_id, 10)
    this.servicioService.saveSoliciatudTrueque(this.registerForm.value).subscribe({
      next: value =>{
        this.msgSucces();
        this.goBack();
      },
      error: err =>{
        console.error(err);
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
      'Solicitud registrada con exito, el usuario vendedor revisara el trueque',
      'success'
    );
  }

  goBack() {
    this.router.navigate(['personal/servicios-registrados'])
  }



}
