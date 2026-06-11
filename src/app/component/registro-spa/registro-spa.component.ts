import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpaApiService } from './../../services/spa-api.service';
import { RegistroSpa } from './../../models/registro-spa.model';

@Component({
  selector: 'app-registro-spa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-spa.component.html',
  styleUrls: ['./registro-spa.component.css']
})
export class RegistroSpaComponent implements OnInit {
  spaForm!: FormGroup;
  historial: RegistroSpa[] = [];
  mensajeExito: string = ''; // Este quedará EXCLUSIVO para cuando guardas
  mensajeBusqueda: string = ''; // <-- ¡NUEVA! Exclusiva para cuando buscas
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private spaService: SpaApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    // Obtenemos la fecha y hora local actual formateada para el input datetime-local
    const ahora = new Date();
    const fechaLocalString = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
                            .toISOString().slice(0, 16);
    this.spaForm = this.fb.group({
      fechaIngreso: [fechaLocalString, Validators.required],
      propietario: this.fb.group({
        nombre: ['', Validators.required],
        direccion: ['', Validators.required],
        celular: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
      }),
      nombreMascota: ['', Validators.required],
      raza: ['', Validators.required],
      edad: ['', Validators.required],
      color: ['', Validators.required],
      esAgresivo: [false],
      entraCaminando: [false],
      entraEnBrazos: [false],
      entraEnGuacal: [false],
      estadoPelaje: ['Sano'],
      estadoPiel: ['Sano'],
      estadoOidos: ['Sano'],
      banoGeneral: [false],
      banoMedicado: [false],
      corteRaza: [false],
      observaciones: [''],
      valorServicio: [0, [Validators.required, Validators.min(0)]]
    });
  }

  buscarHistorial(): void {
    const celular = this.spaForm.get('propietario.celular')?.value;
    
    if (!celular) {
      this.mensajeError = 'Por favor, ingresa un número de celular para realizar la búsqueda.';
      return;
    }

    this.spaService.obtenerHistorial(celular).subscribe({
      next: (data) => {
        this.historial = data;
        
        if (data && data.length > 0) {
          this.mensajeBusqueda = `Se encontraron ${data.length} registros para este propietario.`;
          this.mensajeExito = ''; 
          this.mensajeError = '';
          
          // Tomamos el último registro disponible en el historial
          const ultimoRegistro = data[data.length - 1];
          
          // 1. Llenamos datos del Propietario
          this.spaForm.get('propietario.nombre')?.setValue(ultimoRegistro.propietario.nombre);
          this.spaForm.get('propietario.direccion')?.setValue(ultimoRegistro.propietario.direccion);
          
          // 2. Llenamos datos de la Mascota
          this.spaForm.patchValue({
            nombreMascota: ultimoRegistro.nombreMascota,
            raza: ultimoRegistro.raza,
            edad: ultimoRegistro.edad,
            color: ultimoRegistro.color,
            esAgresivo: ultimoRegistro.esAgresivo,
            
            // 3. Llenamos Condiciones de Ingreso de la última visita
            entraCaminando: ultimoRegistro.entraCaminando,
            entraEnBrazos: ultimoRegistro.entraEnBrazos,
            entraEnGuacal: ultimoRegistro.entraEnGuacal,
            estadoPelaje: ultimoRegistro.estadoPelaje || 'Sano',
            estadoPiel: ultimoRegistro.estadoPiel || 'Sano',
            estadoOidos: ultimoRegistro.estadoOidos || 'Sano',

            // 4. MANTENEMOS VALORES POR DEFECTO EN SERVICIOS Y COSTO (Limpios para el nuevo ingreso)
            banoGeneral: false,
            banoMedicado: false,
            corteRaza: false,
            valorServicio: 0,
            observaciones: ''
          });

        } else {
          this.mensajeError = 'No se encontraron registros previos para este número de celular.';
          this.mensajeExito = '';
          
          // Limpiamos todo el formulario (excepto el celular buscado y la fecha)
          this.spaForm.get('propietario.nombre')?.setValue('');
          this.spaForm.get('propietario.direccion')?.setValue('');
          this.spaForm.patchValue({
            nombreMascota: '', raza: '', edad: '', color: '', esAgresivo: false,
            entraCaminando: false, entraEnBrazos: false, entraEnGuacal: false,
            estadoPelaje: 'Sano', estadoPiel: 'Sano', estadoOidos: 'Sano',
            banoGeneral: false, banoMedicado: false, corteRaza: false,
            valorServicio: 0, observaciones: ''
          });
        }
      },
      error: (err) => {
        this.mensajeError = 'Hubo un error al consultar el historial en el servidor.';
        console.error(err);
      }
    });
  }

  guardarRegistro(): void {
    if (this.spaForm.invalid) {
      this.spaForm.markAllAsTouched(); // <-- Esto fuerza a que se muestren los mensajes rojos en los campos que el usuario olvidó llenar
      this.mensajeError = 'Por favor, revisa los campos marcados en rojo antes de guardar.';
      return;
    }

    const payload: RegistroSpa = this.spaForm.value;

    this.spaService.registrarIngreso(payload).subscribe({
      next: (res) => {
        const ahora = new Date();
        const fechaLocalString = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
                          .toISOString().slice(0, 16);
        this.mensajeExito = `¡Registro #${res.id} guardado con éxito para ${res.nombreMascota}!`;
        this.mensajeBusqueda = '';
        this.mensajeError = '';
        this.spaForm.reset({
          fechaIngreso: fechaLocalString,
          propietario: { nombre: '', direccion: '', celular: '' },
          estadoPelaje: 'Sano', estadoPiel: 'Sano', estadoOidos: 'Sano',
          esAgresivo: false, entraCaminando: false, entraEnBrazos: false, entraEnGuacal: false,
          banoGeneral: false, banoMedicado: false, corteRaza: false, valorServicio: 0
        });
        this.historial = [];
      },
      error: (err) => {
        this.mensajeError = 'Hubo un error al conectar con el servidor.';
        this.mensajeExito = '';
        console.error(err);
      }
    });
  }

  eliminarUsuarioCompleto(): void {
    const celular = this.spaForm.get('propietario.celular')?.value;

    if (!celular || celular.trim() === '') {
      this.mensajeError = 'Debe buscar o ingresar el celular de un propietario para poder eliminarlo.';
      return;
    }

    const confirmacion = confirm(`⚠️ ¡ATENCIÓN! ¿Está seguro de que desea eliminar al propietario con celular ${celular}? Esto borrará permanentemente todo su historial de citas y mascotas.`);
    
    if (!confirmacion) return;

    this.spaService.eliminarHistorialYUsuario(celular).subscribe({
      next: () => {
        this.mensajeExito = '¡Usuario y todo su historial eliminados correctamente del sistema!';
        this.mensajeBusqueda = '';
        this.mensajeError = '';
        
        // Limpiamos la pantalla por completo
        this.spaForm.reset({
          fechaIngreso: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
          propietario: { nombre: '', direccion: '', celular: '' },
          estadoPelaje: 'Sano', estadoPiel: 'Sano', estadoOidos: 'Sano',
          esAgresivo: false, entraCaminando: false, entraEnBrazos: false, entraEnGuacal: false,
          banoGeneral: false, banoMedicado: false, corteRaza: false, valorServicio: 0
        });
        this.historial = [];
      },
      error: (err) => {
        this.mensajeError = 'Ocurrió un error al intentar eliminar el registro del servidor.';
        console.error(err);
      }
    });
  }
}
