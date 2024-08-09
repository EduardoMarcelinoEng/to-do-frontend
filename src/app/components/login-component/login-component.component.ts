import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpXhrBackend } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import config from '../../../config';
import { catchError, finalize, map, throwError } from 'rxjs';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})
export class LoginComponentComponent {

  router: Router = new Router();
  btnLoginEl: HTMLButtonElement | null = null;
  emailEl: HTMLInputElement | null = null;
  passwordEl: HTMLInputElement | null = null;
  http: HttpClient = new HttpClient(new HttpXhrBackend({ 
    build: () => new XMLHttpRequest() 
  }));

  constructor(){
  }

  ngAfterViewChecked(){
    this.btnLoginEl = document.querySelector("button");
    this.emailEl = document.querySelector("input[name=email]");
    this.passwordEl = document.querySelector("input[name=password]");
  }

  login(){
    (this.btnLoginEl as HTMLButtonElement).disabled = true;
    
    this.http.post(`${config.urlBase}/user/auth`, {
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
        (this.btnLoginEl as HTMLButtonElement).disabled = false;
      }))
      .subscribe((data: any) => {
        this.clearForm();
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        this.router.navigateByUrl("/admin");
      });
  }

  clearForm(){
    (this.emailEl as HTMLInputElement).value = "";
    (this.passwordEl as HTMLInputElement).value = "";
  }
}
