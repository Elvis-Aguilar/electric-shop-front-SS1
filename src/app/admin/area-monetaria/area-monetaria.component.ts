import { Component, inject } from '@angular/core';
import { Divisa } from '../../core/models/divisa/divisa';
import { DivisaService } from '../../core/services/divisa/divisa.service';
import Swal from 'sweetalert2';
import { RoleDto, UserDto } from '../product/models/users.dto';
import { Router } from '@angular/router';
import { UserService } from '../product/services/users.service';

@Component({
  selector: 'app-area-monetaria',
  standalone: true,
  imports: [],
  templateUrl: './area-monetaria.component.html',
  styleUrl: './area-monetaria.component.css'
})
export class AreaMonetariaComponent {

  userDto: UserDto[] = []
  rolesDto: RoleDto[] = []


  private readonly router = inject(Router)
  private readonly userService = inject(UserService)


  ngOnInit(): void {
    this.getAllUsers()
    this.getAllRoles()

  }

  editRole(id: number) {
    Swal.fire({
      title: 'Cambiar Rol de Usuario',
      html:
        `<select id="roleSelect" class="swal2-input">
           <option value="1">ADMIN</option>
           <option value="2">CLIENTE</option>
           <option value="3">AYUDANTE_INVENTARIO</option>
           <option value="4">AYUDANTE_COMPRAS</option>
           <option value="5">AYUDANTE_PERSONAL</option>
           <option value="6">AYUDANTE_REPORTES</option>
         </select>`,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const role = (document.getElementById('roleSelect') as HTMLSelectElement).value;
        if (!role) {
          Swal.showValidationMessage('Debe seleccionar un rol');
          return false;
        }
        return role;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newRole = result.value;
        // Llamar al servicio para actualizar el rol con el ID y el nuevo rol seleccionado
        this.updateUserRole(id, Number(newRole));
      }
    });
  }

  // Ejemplo de la función para actualizar el rol del usuario
  updateUserRole(id: number, role: number) {
    this.userService.changeRole(id, role).subscribe({
      next: value => {
        Swal.fire({
          title: 'Rol Actualizado',
          text: `El rol ha sido cambiado exitosamente.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.getAllUsers()
      }
    })
  }


  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: value => {
        this.userDto = value
      }
    })
  }

  getAllRoles() {
    this.userService.getAllRoles().subscribe({
      next: value => {
        console.log(value);

        this.rolesDto = value
      }
    })
  }

  getAllByRole(id: number) {
    this.userService.getAllUsersByRoleId(id).subscribe({
      next: value => {
        this.userDto = value
      }
    })
  }


  convertDateToString(created_at: string | Date): string {
    const date = new Date(created_at);
    return date.toISOString().split('T')[0];
  }


}
