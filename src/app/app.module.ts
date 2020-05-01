import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pre-auth/login/login.component';
import { ApiCalls } from './services/apicalls.service';
import { SocketServiceService } from './services/socket-service.service';
import { DashboardComponent } from './after-auth/dashboard/dashboard.component';
import { RegistrationComponent } from './pre-auth/registration/registration.component';
import { AuthGuard } from './services/authService.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SecurePage } from './services/protected.service';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from './after-auth/chat/chat.component';
import { UsersComponent } from './after-auth/users/users.component';
import { RequestComponent } from './after-auth/request/request.component';
import { FriendsComponent } from './after-auth/friends/friends.component';
import { HeaderComponent } from './after-auth/header/header.component';
import { TestComponent } from './after-auth/test/test.component';
import { FormsModule } from '@angular/forms';

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
    HeaderComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    NgbPaginationModule, NgbAlertModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ApiCalls,
    SocketServiceService,
    AuthGuard,
    SecurePage],
  bootstrap: [AppComponent]
})
export class AppModule { }
