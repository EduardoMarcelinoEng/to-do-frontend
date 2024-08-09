import { Routes } from '@angular/router';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { RegisterComponentComponent } from './components/register-component/register-component.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
    { path: '', component: LoginComponentComponent },
    { path: 'login', component: LoginComponentComponent },
    { path: 'registro', component: RegisterComponentComponent },
    { path: 'admin', component: AdminComponent }
];
