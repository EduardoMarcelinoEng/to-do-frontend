import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHandler, HttpXhrBackend } from '@angular/common/http'; 
import { catchError, finalize, map, tap, throwError } from 'rxjs';
import config from '../../../config';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './register-component.component.html',
  styleUrl: './register-component.component.css'
})
export class RegisterComponentComponent {
  router: Router = new Router();
  btnRegisterEl: HTMLButtonElement | null = null;
  emailEl: HTMLInputElement | null = null;
  nameEl: HTMLInputElement | null = null;
  passwordEl: HTMLInputElement | null = null;
  repeatPasswordEl: HTMLInputElement | null = null;
  http: HttpClient = new HttpClient(new HttpXhrBackend({ 
    build: () => new XMLHttpRequest() 
  }));
  
  constructor(){
  }

  ngAfterViewChecked(){
    this.btnRegisterEl = document.querySelector("button");
    this.nameEl = document.querySelector("input[name=name]");
    this.emailEl = document.querySelector("input[name=email]");
    this.passwordEl = document.querySelector("input[name=password]");
    this.repeatPasswordEl = document.querySelector("input[name=repeat-password]");
  }

  register(){
    (this.btnRegisterEl as HTMLButtonElement).disabled = true;

    if(this.passwordEl?.value !== this.repeatPasswordEl?.value) return alert("Senha digitada novamente difere");
    
    this.http.post(`${config.urlBase}/user`, {
      name: this.nameEl?.value,
      email: this.emailEl?.value,
      password: this.passwordEl?.value,
    })
      .pipe(
        map(x => {
          if (x instanceof HttpErrorResponse) {
            throw x;
          }
          return x;
        })
      )
      .pipe(
        catchError(err => {
          alert(err.error);
          return throwError(err);
        })
      )
      .pipe(finalize(()=>{
        (this.btnRegisterEl as HTMLButtonElement).disabled = false;
      }))
      .subscribe(data => {
        this.clearForm();
        alert("Cadastro realizado com sucesso!");
        this.router.navigateByUrl("/login");
      });
  }

  clearForm(){
    (this.emailEl as HTMLInputElement).value = "";
    (this.nameEl as HTMLInputElement).value = "";
    (this.passwordEl as HTMLInputElement).value = "";
    (this.repeatPasswordEl as HTMLInputElement).value = "";
  }
}
