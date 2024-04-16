import { Component, Input, inject } from '@angular/core';
import { ListaAsistencia } from '../../../core/models/evento/lista-asistencia';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario';
import Swal from 'sweetalert2';
import { EventoService } from '../../../core/services/evento/evento.service';

@Component({
  selector: 'app-lista-participantes',
  standalone: true,
  imports: [],
  templateUrl: './lista-participantes.component.html',
  styleUrl: './lista-participantes.component.css'
})
export class ListaParticipantesComponent {

  @Input('id') productoId!: string;
  lista:ListaAsistencia[] = []
  private readonly authService = inject(AuthService)
  private readonly eventoServise = inject(EventoService)

  imagen!: string;


  ngOnInit(): void{
    const param = this.productoId.split('-')[0]
    const id = parseInt(param, 10)
    this.eventoServise.getLitaEventoId(id).subscribe({
      next: value =>{
        this.lista = value
      }
    })
  }


  mostrarUsuario(us?: Usuario) {
    if(!us){
      return
    }
    const filename: string = us.url_foto.split('/').pop() || '';
    this.authService.getImage(filename).subscribe(
      (result) => {
        this.createImageFromBlobUser(result, us);
      },
      (error) => {
        this.imagen = '';
      }
    );
  }

  private createImageFromBlobUser(image: Blob, us: Usuario) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagen = reader.result as string;
      this.mostrarModalUser(us);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private mostrarModalUser(us: Usuario) {
    Swal.fire({
      title: '<strong><u>' + us.nombre_completo + '</u></strong>',
      html: `
        <img class="h-64 w-full" src="${this.imagen}" alt="imagen-produto">
       <br> -> <b>${us.nombre_usuario}</b> 

      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  updateEstaodAsisteanci(estado:number, list: ListaAsistencia){
    list.estado = estado    
    this.eventoServise.updateEstadoAsistenciaId(list).subscribe({
      next: value =>{
        this.modalCompra()        
      }
    })
  }

  updateEstodAsistenciaTaodos(){
    const param = this.productoId.split('-')[0]
    const id = parseInt(param, 10)
    const lista: ListaAsistencia = {evento_id:id, usuario_id:0,estado:2}
    this.eventoServise.updateEstadoAsistencia(lista).subscribe({
      next: value =>{
        this.modalCompra()
        this.todosAsisntente()        
      }
    })
  }

  private todosAsisntente(){
    this.lista.forEach(lis =>{
      lis.estado = 2
    })
  }

  private modalCompra() {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Se confirmo su Asistencia!",
      showConfirmButton: false,
      timer: 1000
    });
  }

  recompensar(){
    const param = this.productoId.split('-')[0]
    const id = parseInt(param, 10)
    const lista: ListaAsistencia = {evento_id:id, usuario_id:0,estado:1}
    this.eventoServise.gratificar(lista).subscribe({
      next: value =>{
        this.msgSucces()        
      }
    })
  }

  msgSucces() {
    Swal.fire(
      'Gratifiacado con exito',
      'Se le ha acreditado 1 moneda del sistema a cada unos de los participantes',
      'success'
    );
  }

}
