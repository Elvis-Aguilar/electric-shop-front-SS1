import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent {

  private readonly router = inject(Router)


  goAreaProductos(){
    this.router.navigate(['area-admin/area-productos'])
  }


}
