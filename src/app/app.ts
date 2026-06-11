import { Component, signal } from '@angular/core';
import { RegistroSpaComponent } from './component/registro-spa/registro-spa.component'; // Apunta a tu carpeta component

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RegistroSpaComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'spapets-frontend';
}
