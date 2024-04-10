import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoEvento } from '../../../core/models/evento/tipo-evento';
import { EventoService } from '../../../core/services/evento/evento.service';
import { Evento } from '../../../core/models/evento/evento';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-evento',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-evento.component.html',
  styleUrl: './edit-evento.component.css'
})
export class EditEventoComponent {

  @Input('id') productoId!: string;
  imagen!: string;
  registerForm!: FormGroup;
  evento!: Evento

  tiposEventos: TipoEvento[] = []
  controlTipoEventos: TipoEvento[] = []

  private readonly eventoService = inject(EventoService)
  private readonly router = inject(Router)

  constructor(private formBuilder: FormBuilder) {
  }

  async ngOnInit(): Promise<void> {
    this.getTipoEventos();
    const param = this.productoId.split('-')[0]
    const id = parseInt(param, 10)
    const result = await this.eventoService.getEventoId(id).toPromise()
    if (result) {
      this.evento = result
      this.getTipoEvento()
      this.initRegisterFrom()
    }
  }

  actulizarEvento() {
    this.registerForm.value.permite_contactar = this.registerForm.value.permite_contactar ? 1 : 0
    this.registerForm.value.es_voluntariado = this.registerForm.value.es_voluntariado ? 1 : 0
    if (!this.validInfo()) {
      return
    }
    this.eventoService.updateEvento(this.registerForm.value, this.evento.evento_id).subscribe({
      next: value => {
        this.msgProductoActualizado();
        this.router.navigate(['personal/eventos-registrados'])
      },
      error: err => {
        this.msgError()
      }
    })
  }

  private validInfo(): boolean {
    if (this.registerForm.value.max_participantes < 0) {
      this.msgCantidadMaxInvalida()
      return false
    }
    if (this.registerForm.value.es_voluntariado === 0) {
      if (this.registerForm.value.remunerar_moneda_local < 0 || this.registerForm.value.remunerar_moneda_sitema < 0) {
        this.msgValorMonedaInvalida()
        return false
      }
      return true
    }
    this.registerForm.value.remunerar_moneda_local = 0;
    this.registerForm.value.remunerar_moneda_sitema = 0;
    return true
  }

  initRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      nombre: [this.evento.nombre || '', Validators.required],
      descripcion: [this.evento.descripcion || '', Validators.required],
      permite_contactar: [this.evento.permite_contactar || 0, Validators.required],
      es_voluntariado: [this.evento.es_voluntariado || 0, Validators.required],
      remunerar_moneda_local: [this.evento.remunerar_moneda_local || 0, Validators.required],
      remunerar_moneda_sitema: [this.evento.remunerar_moneda_sitema || 0, Validators.required],
      max_participantes: [this.evento.max_participantes || 0, Validators.required],
      lugar_realizacion: [this.evento.lugar_realizacion || '', Validators.required],
      fecha_realizacion: [this.evento.fecha_realizacion || '', Validators.required]
    })
  }

  agregarCategoriaEvento(tipo: TipoEvento) {
    if (tipo.alias === 'Todos') {
      return
    }
    const index = this.controlTipoEventos.findIndex(tip => tip.tipo_evento?.tipo_even_id === tipo.tipo_even_id)
    if (index !== -1) {
      this.msgCategoriaYaAsociada()
      return
    }
    const tipoTmp: TipoEvento = { alias: '', descripcion: '', evento_id: this.evento.evento_id, tipo_even_id: tipo.tipo_even_id }
    this.eventoService.asociarCategoriaEvento(tipoTmp).subscribe({
      next: value => {
        this.controlTipoEventos = value
        this.msgCategoriaAsociada()
      },
      error: err => {
        this.msgError()
      }
    });
  }

  private msgCategoriaYaAsociada() {
    Swal.fire(
      'Categoria ya Asociada',
      'La categoria que intenta asociar ya esta asociada al producto',
      'question'
    );
  }

  private msgCategoriaAsociada() {
    Swal.fire(
      'Categoria Asociada',
      'La categoria ha sido asociada con exito',
      'success'
    );
  }

  private getTipoEvento() {
    this.eventoService.getTipoEventoId(this.evento.evento_id).subscribe({
      next: value => {
        this.controlTipoEventos = value
      }
    })
  }

  private getTipoEventos() {
    this.eventoService.getTipoEvento().subscribe({
      next: value => this.tiposEventos = value
    })
  }

  mostrarModaTipoEvento(tipo: TipoEvento) {
    Swal.fire({
      title: '<strong><u>' + tipo.tipo_evento?.alias + '</u></strong>',
      html: `
        <p class="text-xl"> ->  ${tipo.tipo_evento?.descripcion}</p> <hr>
      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  eliminartipoEvento(tipo: TipoEvento) {
    if (this.controlTipoEventos.length === 1) {
      this.msgCategoriasVacia()
      return
    }
    this.eventoService.deletTipoEvento(tipo.control_tipo_ev_id || 1).subscribe({
      next: value => {
        this.controlTipoEventos = value
        this.msgCategoriaEliminada()
      },
      error: err => {
        this.msgError()
      }
    });
  }

  private msgCategoriasVacia() {
    Swal.fire(
      'Categoria no se puede eliminar',
      'El Evento debe de tener al menos una categoria asociada',
      'info'
    );
  }

  private msgCategoriaEliminada() {
    Swal.fire(
      'Categoria eliminar',
      'La categoria a sido desasociado con el producto',
      'success'
    );
  }


  private msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

  private msgCantidadMaxInvalida() {
    Swal.fire(
      'Valor Incorrecto',
      'El numero de participantes maximos debe ser mayor o igual a 0',
      'error'
    );
  }

  private msgValorMonedaInvalida() {
    Swal.fire(
      'Valor Incorrecto',
      'El Valor de la moneda debe ser mayor a 0',
      'error'
    );
  }

  private msgProductoActualizado() {
    Swal.fire(
      'Evento Actulizado con exito',
      'El Evento fue actulizado con exito',
      'success'
    );
  }

}
