import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="layout">
        <section class="brand-panel">
          <div class="badge">
            <div class="badge-inner">CF</div>
          </div>
          <h1>CafeyFlores</h1>
          <h2>La esquina de la 24</h2>
          <p>
            Un espacio acogedor con desayunos tradicionales, platos típicos,
            café caliente y una experiencia cálida para compartir en familia.
          </p>

          <div class="brand-card">
            <span>Especialidades de la casa</span>
            <strong>Café, tigrillo, seco de pollo, tortillas de verde y más</strong>
          </div>
        </section>

        <section class="form-panel">
          <div class="form-card">
            <p class="mini-title">Bienvenido</p>
            <h3>Iniciar sesión</h3>
            <p class="subtitle">Accede para revisar el menú y gestionar tu carrito de compras.</p>

            <label for="username">Usuario</label>
            <input id="username" type="text" placeholder="Username" [(ngModel)]="username" />

            <label for="password">Contraseña</label>
            <input id="password" type="password" placeholder="Password" [(ngModel)]="password" />

            <button id="login-btn" (click)="login()">Ingresar</button>

            <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

            <div class="demo-box">
              <strong>Acceso demo</strong>
              <span>Usuario: admin</span>
              <span>Contraseña: 12345</span>
            </div>

            <p class="link-text">
              ¿No tienes cuenta?
              <a routerLink="/register">Crear cuenta</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .page{
      min-height:100vh;
      background:linear-gradient(135deg,#fff8db 0%,#ffe9a8 50%,#ffd667 100%);
      display:flex;
      align-items:center;
      justify-content:center;
      padding:24px;
    }
    .layout{
      width:100%;
      max-width:1120px;
      display:grid;
      grid-template-columns:1.05fr .95fr;
      background:#fffdf7;
      border-radius:30px;
      overflow:hidden;
      box-shadow:0 20px 60px rgba(99,72,0,.18);
    }
    .brand-panel{
      padding:56px;
      background:linear-gradient(160deg,#fff4c2,#ffe082);
      color:#5b4100;
      display:flex;
      flex-direction:column;
      justify-content:center;
    }
    .badge{
      width:92px;
      height:92px;
      border-radius:24px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:rgba(255,255,255,.55);
      margin-bottom:24px;
    }
    .badge-inner{
      width:64px;
      height:64px;
      border-radius:18px;
      background:linear-gradient(135deg,#d4a90b,#f0bf1a);
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:24px;
      font-weight:700;
      letter-spacing:1px;
    }
    .brand-panel h1{
      margin:0;
      font-size:52px;
      line-height:1;
    }
    .brand-panel h2{
      margin:10px 0 18px;
      font-size:26px;
      font-weight:700;
      color:#7a5600;
    }
    .brand-panel p{
      max-width:480px;
      font-size:17px;
      line-height:1.7;
      color:#6d5207;
      margin-bottom:28px;
    }
    .brand-card{
      display:flex;
      flex-direction:column;
      gap:6px;
      max-width:390px;
      padding:18px 20px;
      border-radius:18px;
      background:rgba(255,255,255,.62);
      border:1px solid rgba(255,255,255,.6);
    }
    .brand-card span{
      color:#8a6500;
      font-size:14px;
      text-transform:uppercase;
      letter-spacing:.5px;
    }
    .brand-card strong{
      color:#5b4100;
      font-size:18px;
      line-height:1.5;
    }
    .form-panel{
      padding:48px 38px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#fffdf9;
    }
    .form-card{
      width:100%;
      max-width:390px;
    }
    .mini-title{
      margin:0 0 6px;
      text-transform:uppercase;
      letter-spacing:1px;
      font-size:13px;
      color:#b18200;
      font-weight:700;
    }
    h3{
      margin:0 0 10px;
      font-size:34px;
      color:#403000;
    }
    .subtitle{
      margin:0 0 22px;
      color:#7a6641;
      line-height:1.5;
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
      color:#ffffff;
      font-weight:700;
      cursor:pointer;
      box-shadow:0 10px 20px rgba(212,169,11,.25);
    }
    button:hover{
      filter:brightness(.98);
    }
    .error{
      margin-top:14px;
      color:#c62828;
      font-weight:700;
    }
    .demo-box{
      margin-top:20px;
      padding:16px;
      border-radius:16px;
      background:#fff6d8;
      display:flex;
      flex-direction:column;
      gap:4px;
      color:#6d5207;
      border:1px solid #f1df9c;
    }
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
    @media (max-width: 900px){
      .layout{
        grid-template-columns:1fr;
      }
      .brand-panel{
        padding:34px;
      }
      .form-panel{
        padding:34px 24px;
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.errorMessage = '';
    const success = this.authService.login(this.username.trim(), this.password.trim());

    if (!success) {
      this.errorMessage = 'Usuario o contraseña incorrectos.';
      return;
    }

    this.router.navigate(['/products']);
  }
}
