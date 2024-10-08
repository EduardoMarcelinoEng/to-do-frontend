import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import utils from '../utils';
import config from '../config';
import { HttpClient, HttpErrorResponse, HttpXhrBackend } from '@angular/common/http';
import { catchError, finalize, map, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'to-do-frontend';
  loadingRenewToken: Boolean = false;
  fnSetIntervalMemory: any = undefined;

  http: HttpClient = new HttpClient(new HttpXhrBackend({ 
    build: () => new XMLHttpRequest() 
  }));
  router: Router = new Router();
  constructor(){
    this.fnSetIntervalMemory = setInterval(()=>{
      let token = localStorage.getItem("token");
      if(this.loadingRenewToken || !token) return;

      let diff = utils.timeLeft(token as string);
      
      if(diff < 60){
        this.loadingRenewToken = true;

        this.http.post(`${config.urlBase}/user/refresh`, {}, {
          headers: {
            refresh_token: localStorage.getItem("refreshToken") as string
          }
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
              if(this.fnSetIntervalMemory) clearInterval(this.fnSetIntervalMemory);
              localStorage.clear();
              if(this.router.url.indexOf("/admin") >= 0) this.router.navigateByUrl("/login");
              return throwError(err);
            })
          )
          .pipe(finalize(()=>{
            this.loadingRenewToken = false;
          }))
          .subscribe((data: any) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));
          });
      }
      }, 1000);
  }

  ngAfterViewChecked(){
    let diff = localStorage.getItem("token") && utils.timeLeft(localStorage.getItem("token") as string);
    if(!diff || diff <= 0){
      if(this.router.url.indexOf("/admin") >= 0) this.router.navigateByUrl("/login");
    } else {
      if(this.router.url === "/login") this.router.navigateByUrl("/admin");
    }
  }
}
