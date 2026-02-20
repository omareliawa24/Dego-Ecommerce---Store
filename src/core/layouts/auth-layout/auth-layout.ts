import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayout {

}
