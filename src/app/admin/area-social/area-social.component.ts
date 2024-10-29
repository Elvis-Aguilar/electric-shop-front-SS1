import { Component, inject } from '@angular/core';
import { PostService } from '../product/services/post.service';
import { Post } from '../product/models/post';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/usuario';
import { AreaSocial } from '../product/models/area-social';

@Component({
  selector: 'app-area-social',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './area-social.component.html',
  styleUrl: './area-social.component.css'
})
export class AreaSocialComponent {

  areaSocial: string = 'GENERAL'
  posts: Post[] = []
  post: string = ''


  private readonly authService = inject(AuthService)
  private readonly postService = inject(PostService)


  usuario: Usuario | undefined = this.authService.getUsuarioSesion()

  constructor() {
  }

  ngOnInit(): void {
    this.getAllByArea(this.areaSocial)
  }

  createPost() {
    if (this.post === '') {
      this.msgInvalid()
      return
    }
    const area = this.areaSocial as AreaSocial
    this.postService.createPost({ area_social: area, content: this.post }, this.usuario?.id || 1).subscribe({
      next: value =>{
        console.log(value);
        this.post = ''
        this.getAllByArea(this.areaSocial)
      }
    })

  }

  formatDate(dateString: string):string{
    const date = new Date(dateString);
  
    const fecha = date.toISOString().split('T')[0];
  
    const hora = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return `Fecha: ${fecha} y Hora: ${hora}`
  }

  goAreaSocial(areaSocials: string) {
    this.areaSocial = areaSocials
    this.getAllByArea(areaSocials)
  }

  getAllByArea(areaSocial: string) {
    this.postService.getAllPostsByArea(areaSocial).subscribe({
      next: value => {
        this.posts = value
      }
    })
  }

  msgInvalid() {
    Swal.fire(
      'Upss!',
      'El Post no puede estar vacios XD',
      'question'
    );
  }

  postCread() {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Post Publicado con exito",
      showConfirmButton: false,
      timer: 1500
    });
  }


}
