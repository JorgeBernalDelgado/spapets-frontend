export interface Propietario {
  id?: number;
  nombre: string;
  direccion: string;
  celular: string;
}

export interface RegistroSpa {
  id?: number;
  propietario: Propietario;
  nombreMascota: string;
  raza: string;
  edad: string;
  color: string;
  esAgresivo: boolean;
  entraCaminando: boolean;
  entraEnBrazos: boolean;
  entraEnGuacal: boolean;
  estadoPelaje: string;
  estadoPiel: string;
  estadoOidos: string;
  banoGeneral: boolean;
  banoMedicado: boolean;
  corteRaza: boolean;
  observaciones: string;
  valorServicio: number;
  fechaIngreso?: string;
}