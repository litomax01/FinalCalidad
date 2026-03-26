import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="card">
        <div class="top">
          <div class="icon-block">
            <div class="icon-inner">CF</div>
          </div>
          <div>
            <h1>Crear cuenta</h1>
            <p>Únete a CafeyFlores - La esquina de la 24</p>
          </div>
        </div>

        <label for="name">Nombre</label>
        <input id="name" type="text" [(ngModel)]="name" />

        <label for="register-username">Usuario</label>
        <input id="register-username" type="text" [(ngModel)]="username" />

        <label for="register-password">Contraseña</label>
        <input id="register-password" type="password" [(ngModel)]="password" />

        <button id="register-btn" (click)="register()">Registrar cuenta</button>

        <p class="message success" *ngIf="successMessage">{{ successMessage }}</p>
        <p class="message error" *ngIf="errorMessage">{{ errorMessage }}</p>

        <p class="link-text">
          ¿Ya tienes cuenta?
          <a routerLink="/login">Volver al inicio de sesión</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .page{
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background:linear-gradient(135deg,#fff8dd,#ffe59d,#ffd666);
      padding:24px;
    }
    .card{
      width:100%;
      max-width:520px;
      background:#fffdf7;
      border-radius:28px;
      padding:34px;
      box-shadow:0 20px 50px rgba(99,72,0,.16);
    }
    .top{
      display:flex;
      align-items:center;
      gap:16px;
      margin-bottom:18px;
    }
    .icon-block{
      width:66px;
      height:66px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:18px;
      background:#fff3bf;
    }
    .icon-inner{
      width:44px;
      height:44px;
      border-radius:12px;
      background:linear-gradient(135deg,#d4a90b,#f0bf1a);
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:700;
    }
    h1{
      margin:0;
      color:#4c3900;
    }
    .top p{
      margin:6px 0 0;
      color:#7a6641;
    }
    label{
      display:block;
      margin:14px 0 8px;
      font-weight:700;
      color:#5e4700;
    }
    input{
      width:100%;
      padding:14px 16px;
      border-radius:14px;
      border:1px solid #ead38b;
      background:#fffdfa;
      outline:none;
    }
    input:focus{
      border-color:#d4a90b;
      box-shadow:0 0 0 3px rgba(212,169,11,.15);
    }
    button{
      width:100%;
      margin-top:20px;
      padding:14px;
      border:none;
      border-radius:14px;
      background:linear-gradient(90deg,#d4a90b,#f0bf1a);
      color:#fff;
      font-weight:700;
      cursor:pointer;
      box-shadow:0 10px 20px rgba(212,169,11,.25);
    }
    .message{
      margin-top:14px;
      font-weight:700;
    }
    .success{ color:#2e7d32; }
    .error{ color:#c62828; }
    .link-text{
      margin-top:18px;
      text-align:center;
      color:#7a6641;
    }
    a{
      color:#b18200;
      font-weight:700;
      text-decoration:none;
    }
  `]
})
export class RegisterComponent {
  name = '';
  username = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.name.trim() || !this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    const result = this.authService.register(this.name.trim(), this.username.trim(), this.password.trim());

    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }

    this.successMessage = result.message;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }
}
