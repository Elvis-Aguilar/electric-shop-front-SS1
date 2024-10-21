import { Component, Input, inject } from '@angular/core';
import { Producto } from '../../../core/models/producto/producto';
import { ProductoService } from '../../../core/services/productos/producto.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-trueque',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './solicitud-trueque.component.html',
  styleUrl: './solicitud-trueque.component.css'
})
export class SolicitudTruequeComponent {
  
  @Input('id') productoId!: string;

  producto!: Producto
  productos: Producto[] = []

  registerForm!: FormGroup;


  private readonly productoService = inject(ProductoService)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)


  constructor(private formBuilder: FormBuilder) {
    
  } 


  ngOnInit(): void {
    const param = this.productoId.split('-')[0]
    const id = parseInt(param, 10)
    this.productoService.getProdcutoId(id).subscribe(
      (result) => {
        this.producto = result
        this.initRegisterFrom()
      }
    )
    this.productoService.getProductosUsuario(this.authService.getUsuarioSesion()?.id || 0).subscribe({
      next: value =>{
        this.productos = value
      }
    })
  
  }

  initRegisterFrom() {
    const idSoliciatne = this.authService.getUsuarioSesion()?.id || 0
    const idUser = this.producto.usuario_vendedor
    this.registerForm = this.formBuilder.group({
      estado: [1, Validators.required],
      usuario_solicitante_id:[idSoliciatne, Validators.required],
      usuario_propietario_id: [idUser, Validators.required],
      producto_solicitado_id: [this.producto.producto_id, Validators.required],
      producto_intercambiar_id: [null, Validators.required],
      cantidad_dar : [1, Validators.required],
      cantdad_solicitar: [1, Validators.required]
    })
  }

  register(){
    this.registerForm.value.producto_intercambiar_id = parseInt(this.registerForm.value.producto_intercambiar_id, 10)
    this.productoService.saveSoliciatudTrueque(this.registerForm.value).subscribe({
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
    this.router.navigate(['area-productos/home'])
  }
}
