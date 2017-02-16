import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

// Import Pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { Gallary } from '../pages/gallary/gallary';
import { LargeView } from '../pages/large-view/large-view';

// Import Providers
import { AuthData } from '../providers/auth-data';
import { GallaryData } from '../providers/gallary-data';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    Gallary,
    LargeView
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    Gallary,
    LargeView    
  ],
  providers: [
    AuthData,
    GallaryData
  ]
})
export class AppModule {}
