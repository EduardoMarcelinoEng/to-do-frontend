import { HttpClient, HttpErrorResponse, HttpXhrBackend } from '@angular/common/http';
import { Component } from '@angular/core';
import config from '../../../config';
import { catchError, finalize, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

enum PriorityTask {
  Baixa = "Baixa",
  Media = "Média",
  Alta = "Alta"
}

interface Task {
  id: string;
  description: string;
  priority: PriorityTask
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  tasks: Task[] = [];
  descriptionEl: HTMLInputElement | null = null;
  priorityEl: HTMLSelectElement | null = null;
  router: Router = new Router();
  http: HttpClient = new HttpClient(new HttpXhrBackend({ 
    build: () => new XMLHttpRequest() 
  }));

  ngAfterViewChecked(){
    this.descriptionEl = document.querySelector("input[name=description]");
    this.priorityEl = document.querySelector("select[name=priority]");
  }

  ngOnInit(){
    this.http.get(`${config.urlBase}/task/get-pending`, {
      headers: {
        auth: localStorage.getItem("token") as string
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
          alert("Falha ao carregar tarefas pendentes! Entre em contato com o suporte.");
          console.log(err);
          return throwError(err);
        })
      )
      .subscribe((data: any) => {
        this.tasks = data;
      });
  }

  logout(){
    this.http.post(`${config.urlBase}/user/logout`, {}, {
      headers: {
        auth: localStorage.getItem("token") as string,
        refresh_token: localStorage.getItem("refreshToken") as string
      }
    })
      .subscribe();
    localStorage.clear();
    this.router.navigateByUrl("/login");
  }

  createTask(event: any){
    event.target.disabled = true;
    this.http.post(`${config.urlBase}/task`, {
      description: this.descriptionEl?.value,
      priority: this.priorityEl?.value
    }, {
      headers: {
        auth: localStorage.getItem("token") as string
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
          alert(err.error);
          return throwError(err);
        })
      )
      .pipe(finalize(()=>{
        event.target.disabled = false;
      }))
      .subscribe(data=>{
        this.tasks = [data as Task, ...this.tasks];
        (this.descriptionEl as HTMLInputElement).value = "";
        (this.priorityEl as HTMLSelectElement).value = "Baixa";
        alert("Tarefa criada com sucesso!");
      });
  }

  markAsDone(event: any, id: string){
    event.target.disabled = true;
    this.http.put(`${config.urlBase}/task/mark-as-done/${id}`, {}, {
      headers: {
        auth: localStorage.getItem("token") as string
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
          alert(err.error);
          return throwError(err);
        })
      )
      .pipe(finalize(()=>{
        event.target.disabled = false;
      }))
      .subscribe(()=>{
        this.tasks = this.tasks.filter(task => task.id !== id);
        alert("Tarefa marcada como concluída!");
      });
  }
}
