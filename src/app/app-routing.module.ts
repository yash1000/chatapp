import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { SecurePage } from './services/protected.service';
import { AuthGuard } from './services/authService.service';
import { ChatComponent } from './chat/chat.component';
import { UsersComponent } from './users/users.component';
import { RequestComponent } from './request/request.component';
import { FriendsComponent } from './friends/friends.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', canActivate: [AuthGuard], component: LoginComponent},
  {path: 'dashboard', canActivate: [SecurePage], component: DashboardComponent},
  {path: 'registration', canActivate: [AuthGuard], component: RegistrationComponent},
  {path: 'chat', canActivate: [SecurePage], component: ChatComponent},
  {path: 'users', canActivate: [SecurePage], component: UsersComponent},
  {path: 'request', canActivate: [SecurePage], component: RequestComponent},
  {path: 'friends', canActivate: [SecurePage], component: FriendsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
