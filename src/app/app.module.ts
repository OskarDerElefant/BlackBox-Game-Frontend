import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { ChatComponent } from './components/chat/chat.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule, MatIconModule, MatToolbarModule, MatTooltipModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent } ,
  { path: 'home', component: MenuComponent } ,
  { path: 'chat', component: ChatComponent } ,
  { path: 'statistics', component: StatisticComponent } ,
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    ChatComponent,
    StatisticComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule.forRoot(appRoutes, {enableTracing: false})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
