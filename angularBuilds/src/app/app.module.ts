import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MenubarComponent } from './menubar/menubar.component';
import { NewsongComponent } from './newsong/newsong.component';
import { UserComponent } from './user/user.component';
import { SongService } from './newsong/song-service.service';
import { UserService } from './user/user-service.service';
import { ReviewsGivenComponent } from './user/reviews-given/reviews-given.component';
import { FooterComponent } from './footer/footer.component';
import { UserSongsComponent } from './user/user-songs/user-songs.component';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from "angular5-social-login";

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("1048829641570-0o3gqdk5i3a8gfcfbk300lp4rsmdijgp.apps.googleusercontent.com")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    MenubarComponent,
    NewsongComponent,
    UserComponent,
    ReviewsGivenComponent,
    FooterComponent,
	  UserSongsComponent
  ],
  imports: [
    BrowserModule,
	  FormsModule,
	  HttpModule,
	  NgbModule.forRoot(),
    routing, 
    SocialLoginModule
  ],
  providers: [SongService, UserService, {provide: AuthServiceConfig, useFactory: provideConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
