import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController); //para mostrar el error
  router = inject(Router);


  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: "Selecciona una imagen",
      promptLabelPicture: "Toma una foto"
    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)

    // var imageUrl = image.webPath;
    // imageElement.src = imageUrl;
    // Can be set to the src of an image now

    
  };

  loading(){
    return this.loadingCtrl.create({spinner: 'crescent'});
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //enruta a cualquier pagina
  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

  guardarEnLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value));
  }


  getLocalStorage(key: string){
    const value = localStorage ? localStorage.getItem(key) : null;
    return value ? JSON.parse(value) : null;
    // return JSON.parse(localStorage.getItem(key));
  }

}
