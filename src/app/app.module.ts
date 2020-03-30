import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ApiCalls } from './services/apicalls.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthGuard } from './services/authService.service';
// import { NgHttpLoaderModule } from 'ng-http-loader'; 
// import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SecurePage } from './services/protected.service';
import { ChatComponent } from './chat/chat.component';
import { UsersComponent } from './users/users.component';
import { RequestComponent } from './request/request.component';
import { FriendsComponent } from './friends/friends.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegistrationComponent,
    ChatComponent,
    UsersComponent,
    RequestComponent,
    FriendsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    // NgHttpLoaderModule.forRoot(),
    // NgHttpLoaderModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ApiCalls,
    AuthGuard,
    SecurePage],
  bootstrap: [AppComponent]
})
export class AppModule { }
