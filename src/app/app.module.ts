import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { ChatComponent } from './components/chat/chat.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatSelect,
  MatSelectModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import { ChatElementComponent } from './components/chat/chat-element/chat-element.component';
import {NbThemeModule, NbChatModule, NbLayoutModule} from '@nebular/theme';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent } ,
  { path: 'logout', component: LoginComponent},
  { path: 'home', component: MenuComponent } ,
  { path: 'chat/:selectedStory', component: ChatComponent } ,
  { path: 'statistics', component: StatisticComponent } ,
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    ChatComponent,
    StatisticComponent,
    ChatElementComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {enableTracing: false}),
    NbThemeModule.forRoot({name: 'default'}),
    NbLayoutModule,
    NbChatModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
