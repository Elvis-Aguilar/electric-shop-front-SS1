import { Component, Input, inject } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/producto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria } from '../../core/models/categoria';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-producto.component.html',
  styleUrl: './edit-producto.component.css'
})
export class EditProductoComponent {

  @Input('id') productoId!: string;

  producto!: Producto
  imagen!: string;
  myGroup!: FormGroup;

  categorias: Categoria[] = []
  categoriasProducto: Categoria[] = []


  private readonly productoService = inject(ProductoService)

  constructor(private formBuilder: FormBuilder) {
  }

  async ngOnInit(): Promise<void> {
    this.getCategorias()
    const param = this.productoId.split('-')[0]
    const id = parseInt(param, 10)
    const result = await this.productoService.getProdcutoId(id).toPromise()
    if (result) {
      this.producto = result
      console.log(this.producto);

      this.getCategoriaProducto()
      this.initRegisterFrom()
    }
  }

  initRegisterFrom() {
    this.myGroup = this.formBuilder.group({
      nombre: [this.producto?.nombre || '', Validators.required],
      descripcion: [this.producto?.descripcion || '', Validators.required],
      especificaciones: [this.producto?.especificaciones || '', Validators.required],
      cantidad_exit: [this.producto?.cantidad_exit || '', Validators.required],
      permite_trueque: [this.producto?.permite_trueque || 0],
      permite_contactar: [this.producto?.permite_contactar || 0],
      moneda_local: [this.producto?.moneda_local || '', Validators.required],
      moneda_sistema: [this.producto?.moneda_sistema || '', Validators.required],
    });
  }

  actulizarProducto() {
    this.myGroup.value.permite_contactar = this.myGroup.value.permite_contactar ? 1 : 0
    this.myGroup.value.permite_trueque = this.myGroup.value.permite_trueque ? 1 : 0
    if (!this.validInfo()) {
      return
    }
    console.log(this.myGroup.value);
    this.productoService.updateProducto(this.myGroup.value, this.producto.producto_id).subscribe(
      (result) => {
        this.msgProductoActualizado()
      },
      (error) => {
        console.log(error);
        this.msgError()

      }
    )

  }

  private validInfo(): boolean {


    if (this.myGroup.value.moneda_local < 0 || this.myGroup.value.moneda_sistema < 0) {
      this.msgMonedaInvalida()
      return false
    }
    if (this.myGroup.value.cantidad_exit < 0) {
      this.msgCantidadInvalid()
      return false
    }
    return true
  }

  msgMonedaInvalida() {
    Swal.fire(
      'Valor de moneda incorrecto',
      'El valor del producto debe ser mayor o igual a 0',
      'error'
    );
  }

  msgProductoActualizado() {
    Swal.fire(
      'Producto Actulizado con exito',
      'El producto fue actulizado con exito',
      'success'
    );
  }

  msgCantidadInvalid() {
    Swal.fire(
      'Valor de Cantidad incorrecto',
      'La cantidad de producto existentes del producto debe ser mayor o igual a 0',
      'error'
    );
  }

  getCategorias() {
    this.productoService.getCategories().subscribe(
      (result) => {
        this.categorias = result
      }
    );
  }

  getCategoriaProducto() {
    this.productoService.getCategoriaProducto(this.producto.producto_id).subscribe(
      (result) => {
        this.categoriasProducto = result;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  mostrarModalCategoria(catego: Categoria) {
    Swal.fire({
      title: '<strong><u>' + catego.categoria?.alias + '</u></strong>',
      html: `
        <p class="text-xl"> ->  ${catego.categoria?.descripcion}</p> <hr>
      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  eliminarCategoria(cate: Categoria) {
    if (this.categoriasProducto.length === 1) {
      this.msgCategoriasVacia()
      return
    }
    this.productoService.deletCategoriaProdcuto(cate?.categoria_producto_id || 1).subscribe(
      (result) => {
        this.categoriasProducto = result;
        this.msgCategoriaEliminada()
      },
      (error) => {
        console.log(error);
        this.msgError()
      }
    )
  }

  agregarCategoriaProdcuto(categ: Categoria) {
    const index = this.categoriasProducto.findIndex(categoria => categoria.categoria?.categoria_id === categ.categoria_id)
    if (categ.alias === 'Todos') {
      return
    }
    if (index !== -1) {
      this.msgCategoriaYaAsociada()
      return
    }
    const cate: Categoria = { alias: '', descripcion: '', estado: this.producto.producto_id, categoria_id: categ.categoria_id }
    this.productoService.asociarCategoriaProducto(cate).subscribe(
      (result) => {
        this.categoriasProducto = result
        this.msgCategoriaAsociada()
      },
      (error) => {
        console.log(error);

        this.msgError();
      })
  }

  msgCategoriasVacia() {
    Swal.fire(
      'Categoria no se puede eliminar',
      'El producto debe de tener al menos una categoria asociada',
      'info'
    );
  }

  msgCategoriaAsociada() {
    Swal.fire(
      'Categoria Asociada',
      'La categoria ha sido asociada con exito',
      'success'
    );
  }

  msgCategoriaYaAsociada() {
    Swal.fire(
      'Categoria ya Asociada',
      'La categoria que intenta asociar ya esta asociada al producto',
      'question'
    );
  }


  msgCategoriaEliminada() {
    Swal.fire(
      'Categoria eliminar',
      'La categoria a sido desasociado con el producto',
      'success'
    );
  }

  msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }



}
