import { Component, Inject, inject } from '@angular/core';
import { ProductoService } from '../../../core/services/productos/producto.service';
import { Categoria } from '../../../core/models/producto/categoria';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-form-public-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-public-producto.component.html',
  styleUrl: './form-public-producto.component.css'
})
export class FormPublicProductoComponent {


  categorias: Categoria[] = []
  registerForm!: FormGroup;
  file!: File
  formData!: FormData

  private readonly productoService = inject(ProductoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);


  constructor(private formBuilder: FormBuilder) {
    this.getCategorias();
    this.initRegisterFrom()
  }

  initRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, Validators.required],
      available_quantity: [null, Validators.required],
      supplier_id: 0,
      category_id: 0,
      image_url: ''
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







  /**REvisar XD*/

  register() {
    if (this.validarInfo()) {
      this.productoService.saveImgProducto(this.formData).subscribe(
        (result) => {
          this.registerForm.value.url_foto = result.url_foto
          this.registrarInfoProducto();
        },
        (error) => {
          this.msgError()
          console.log(error)
        }
      )
    }
  }

  registrarInfoProducto() {
    this.productoService.saveProducto(this.registerForm.value).subscribe(
      (result) => {
        //console.log(result)
        this.msgSucces();
        this.router.navigate(['personal/productos-registrados'])
      },
      (error) => {
        this.msgError()
      }
    );
  }

  validarInfo(): boolean {
    if (this.registerForm.value.cantidad_exit <= 0) {
      Swal.fire(
        'Datos Incorrectos!',
        'La cantidad existente debe ser mayor a 0',
        'info'
      );
      return false
    }
    if (this.registerForm.value.moneda_local <= 0 || this.registerForm.value.moneda_sistema <= 0) {
      Swal.fire(
        'Datos Incorrectos!',
        'El precio debe ser mayor a 0',
        'info'
      );
      return false
    }
    if (this.registerForm.value.categoria === 'Todos') {
      this.registerForm.value.categoria = this.categorias.find(cate => cate.alias === this.registerForm.value.categoria)?.categoria_id
    } else {
      this.registerForm.value.categoria = parseInt(this.registerForm.value.categoria)
    }
    if (this.authService.getUsuarioSesion()?.id) {
      this.registerForm.value.usuario_vendedor = this.authService.getUsuarioSesion()?.id
    } else {
      this.registerForm.value.usuario_vendedor = this.authService.getUsuarioSesion()?.id
    }
    if (this.registerForm.value.permite_trueque) {
      this.registerForm.value.permite_trueque = 1
    } else {
      this.registerForm.value.permite_trueque = 0
    }
    if (this.registerForm.value.permite_contactar) {
      this.registerForm.value.permite_contactar = 1
      return true;
    }
    this.registerForm.value.permite_contactar = 0;
    return true;
  }



  getCategorias() {
    this.productoService.getCategories().subscribe(
      (result) => {
        this.categorias = result
      }
    );
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
