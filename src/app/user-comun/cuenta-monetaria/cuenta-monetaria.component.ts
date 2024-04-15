import { Component, inject } from '@angular/core';
import { Divisa } from '../../core/models/divisa/divisa';
import { DivisaService } from '../../core/services/divisa/divisa.service';
import { AuthService } from '../../core/services/auth.service';
import { CuentaMonetaria } from '../../core/models/cuenta-monetaria';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuenta-monetaria',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cuenta-monetaria.component.html',
  styleUrl: './cuenta-monetaria.component.css'
})
export class CuentaMonetariaComponent {

  divisia!: Divisa;
  cuentaMonetari!: CuentaMonetaria;
  private readonly divisaServise = inject(DivisaService)
  private readonly authService = inject(AuthService)
  opcion: number = 0
  registerForm!: FormGroup;
  formData!: FormData

  constructor(private formBuilder: FormBuilder) {

  }


  ngOnInit(): void {
    this.initRegisterFrom()
    this.getDivisa()
    this.getCuentaMonetaria();
  }

  private getDivisa() {
    this.divisaServise.getDivisa().subscribe({
      next: value => {
        this.divisia = value
      }
    })
  }

  private getCuentaMonetaria() {
    const id = this.authService.getUsuarioSesion()?.usuario_id || 0
    if (id === 0) {
      return
    }
    this.authService.getCuentaMonetaria(id).subscribe({
      next: value => {
        this.cuentaMonetari = value
      }
    })
  }

  cambiarOpcion(op: number) {
    this.opcion = op
  }

  initRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      cantidad_recarga: [null, Validators.required],
      codigo: [null, Validators.required],
      tarjeta: [null, Validators.required],
    })
  }

  recargar() {
    if (!this.validarCantidad()) {
      return
    }
    switch (this.opcion) {
      case 1:
        //recargar moneda del sistema
        const cantidad = parseFloat(this.registerForm.value.cantidad_recarga)
        this.cuentaMonetari.moneda_ms = cantidad + parseFloat(this.cuentaMonetari.moneda_ms + '')
        this.authService.updateCuentaMonetaria(this.cuentaMonetari).subscribe({
          next: value => {
            this.cuentaMonetari = value
            this.initRegisterFrom()
            this.opcion = 0
            this.msgSucces()
          },
          error: err => {
            this.msgError()
          }
        })
        break;
      case 2:
        const cantidadQ = parseFloat(this.registerForm.value.cantidad_recarga)
        this.cuentaMonetari.moneda_local = cantidadQ + parseFloat(this.cuentaMonetari.moneda_local + '')
        this.authService.updateCuentaMonetaria(this.cuentaMonetari).subscribe({
          next: value => {
            this.cuentaMonetari = value
            this.initRegisterFrom()
            this.opcion = 0
            this.msgSucces()
          },
          error: err => {
            this.msgError()
          }
        })
        break;
      default:
        break;
    }
  }

  private validarCantidad(): boolean {
    if (this.registerForm.value.cantidad_recarga <= 0) {
      this.msgCantidadInvalida();
      return false;
    }
    return true
  }

  intercambiar(){
    if(!this.validarCantidad()){
      return 
    }
    this.cuentaMonetari.moneda_local = parseFloat(this.cuentaMonetari.moneda_local+'')
    this.cuentaMonetari.moneda_ms = parseFloat(this.cuentaMonetari.moneda_ms+'')
    this.registerForm.value.cantidad_recarga = parseFloat(this.registerForm.value.cantidad_recarga) 
    const nuevaCantidad = this.registerForm.value.cantidad_recarga  * parseFloat(this.divisia.moneda_local+'')
    if(nuevaCantidad >= this.cuentaMonetari.moneda_local){
      this.msgQuetzalesInsucien()
      return 
    }
    this.cuentaMonetari.moneda_local = this.cuentaMonetari.moneda_local - nuevaCantidad
    this.cuentaMonetari.moneda_ms  =  this.cuentaMonetari.moneda_ms  + this.registerForm.value.cantidad_recarga;
    this.authService.updateCuentaMonetaria(this.cuentaMonetari).subscribe({
      next: value => {
        this.cuentaMonetari = value
        this.initRegisterFrom()
        this.opcion = 0
        this.msgSucces()
      },
      error: err => {
        console.log(err);
        
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

  msgQuetzalesInsucien() {
    Swal.fire(
      'Ups!!',
      'No cuenta con el monto en Quetzales para realizar el intercambio',
      'question'
    );
  }

  msgCantidadInvalida() {
    Swal.fire(
      'Cantidad invalida!!',
      'la cantidad debe ser mayor a 0',
      'info'
    );
  }

  msgSucces() {
    Swal.fire(
      'Recarga exitos',
      'Se ha recargado exitosamenta a su cuenta la cantidad solicitada',
      'success'
    );
  }

}
