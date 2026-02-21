import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../shared/components/footer/footer.component";
import { ToastComponent } from "../shared/components/toast/toast.component";
import { NgxSpinnerModule } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, ToastComponent,NgxSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dego');
}
