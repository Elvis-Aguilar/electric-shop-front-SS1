import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { categoriaDto } from '../../area-categorias/models/category.dto';
import { supplier } from '../../area-provedores/models/supplir.dto';
import { CategoryService } from '../../area-categorias/services/category.service';
import { SupplierService } from '../../area-provedores/services/supplier.service';
import { ProductService } from '../services/product.service';
import { UploadImgService } from '../../../config/upload-img.service';
import { productDto } from '../models/product.dto';


@Component({
  selector: 'app-edit-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-producto.component.html',
  styleUrl: './edit-producto.component.css'
})
export class EditProductoComponent {

  @Input('id') productoId!: string;

  registerForm!: FormGroup;
  file!: File
  formData!: FormData
  producto!: productDto


  categories: categoriaDto[] = []
  suppliers: supplier[] = []

  private readonly categoryService = inject(CategoryService)
  private readonly suppliersServices = inject(SupplierService)
  private readonly productServcie = inject(ProductService)
  private readonly router = inject(Router);
  private readonly uploadService = inject(UploadImgService)


  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.productServcie.getById(Number(this.productoId)).subscribe({
      next: value => {
        this.producto = value
        this.initRegisterFrom()
      }
    })
    this.getAllCategories()
    this.getAllSupliers()
  }


  initRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      name: [this.producto.name, Validators.required],
      description: [this.producto.description, Validators.required],
      price: [this.producto.price, Validators.required],
      stock: [this.producto.stock, Validators.required],
      supplier: [this.producto.supplier.id, Validators.required],
      category: [this.producto.category.id, Validators.required],
      image: ['']
    })
  }

  getAllCategories() {
    this.categoryService.getAll().subscribe({
      next: value => {
        this.categories = value
      }
    })
  }

  getAllSupliers() {
    this.suppliersServices.getAllSupplier().subscribe({
      next: value => {
        this.suppliers = value
      }
    })
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement != null && inputElement.files != null && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      this.formData = new FormData();
      this.formData.append('file', this.file, this.file.name);
    }
  }

  private async uplogadImag(): Promise<void> {
    if (this.formData) {
      try {
        const value = await this.uploadService.saveImg(this.formData).toPromise(); // Convertimos a Promesa
        this.registerForm.value.image = value.url;
      } catch (err) {
        console.error('Error al subir la imagen: ', err);
        // TODO: manejar errores, por ejemplo, mostrar un mensaje de "intente de nuevo"
      }
    } else {
      this.registerForm.value.image = this.producto.image
    }
  }


  async register() {

    this.registerForm.value.category = Number(this.registerForm.value.category)
    this.registerForm.value.supplier = Number(this.registerForm.value.supplier)
    this.registerForm.value.price = Number(this.registerForm.value.price)

    await this.uplogadImag()

    this.productServcie.updateProdcut(this.producto.id, this.registerForm.value).subscribe({
      next: value => {

        this.msgSucces()
        this.router.navigate(['area-admin/area-productos'])

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
      'Ocurrio un erro al intetar registrar el producto',
      'error'
    );
  }

  msgSucces() {
    Swal.fire(
      'Registro Exitoso',
      'Su registro del producto al sistema ha sido exitoso!',
      'success'
    );
  }

}
