import { Component, inject } from '@angular/core';
import { Divisa } from '../../core/models/divisa/divisa';
import { DivisaService } from '../../core/services/divisa/divisa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-area-monetaria',
  standalone: true,
  imports: [],
  templateUrl: './area-monetaria.component.html',
  styleUrl: './area-monetaria.component.css'
})
export class AreaMonetariaComponent {

  divisia!: Divisa;
  private readonly divisaServise = inject(DivisaService)

  ngOnInit(): void {
    this.getDivisa()
  }

  getDivisa(){
    this.divisaServise.getDivisa().subscribe({
      next: value => {
        this.divisia = value
      }
    })
  }

  async modalUpdateDivisa() {
    const { value: text } = await Swal.fire({
      input: "text", // Cambiado a "text" para permitir decimales
      inputLabel: "Valor de intercambio de ms: 1 a Q: ?",
      inputPlaceholder: "1",
      inputAttributes: {
        "aria-label": "Type your message here",
        "type": "number",
        "step": "any" 
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      preConfirm: (result) => {
        // Validar manualmente si la entrada es un número decimal
        if (!/^\d*\.?\d*$/.test(result)) {
          Swal.showValidationMessage(
            `Ingrese un valor válido`
          );
        } else {
          const parsedResult = parseFloat(result);
          if (isNaN(parsedResult)) {
            Swal.showValidationMessage(
              `Ingrese un valor válido`
            );
          } else {
            // Si la entrada es un número decimal válido, hacer lo que necesites con el valor
            this.verificacionCantidad(parsedResult);
          }
        }
      }
    });
    

    if (text) {
      this.updateDivisa(text)
    }
  }

  private verificacionCantidad(cantidad: number) {
    if (cantidad <= 0) {
      Swal.showValidationMessage(
        `La cantidad debe ser mayor a 0`
      )
    }
  }

  private updateDivisa(cantidad:number){
    const divis: Divisa = {moneda_local:cantidad, moneda_sistema: 1, divisa_id: this.divisia.divisa_id}
    this.divisaServise.updateDivis(divis).subscribe({
      next: value =>{
        this.divisia = value
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Divisa Actulizada con exito",
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

}
