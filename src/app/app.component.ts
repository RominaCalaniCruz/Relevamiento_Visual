import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SplashComponent } from './splash/splash.component';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
// import { Plugins } from '@capacitor/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // constructor(private modalCtrl: ModalController) {
  //   this.presentSplash();
  // }

  // async presentSplash(){
  //   const modal= await this.modalCtrl.create({
  //     component: SplashComponent,
  //     cssClass: 'my-custom-class'
  //   });
  //   return await modal.present();
  // }
  constructor(
    private platform: Platform,
    public router:Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.router.navigateByUrl('splas-dinamico');
    });
    await SplashScreen.show({
      showDuration: 5000,
      autoHide: true,
    });
    await SplashScreen.hide();
  }
}
