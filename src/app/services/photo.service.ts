import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FirestoreService } from './firestore.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  user: any = null;
  constructor(
    private authService: FirebaseService,
    private angularFirestorage: AngularFireStorage,
    private firestoreService: FirestoreService,
    private utilSvc: UtilsService
  ) {
    // this.authService.user$.subscribe((user: any) => {
    //   if (user) {
    //     this.user = user;
    //   }
    // });
  }

  async addNewToGallery(photo: any, type: number) {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100,
      webUseInput: true,
    });

    const storage = getStorage();
    const date = new Date().getTime();

    photo.hour = date;

    const name = `${this.user.userEmail} ${date}`;
    const storageRef = ref(storage, name);
    const url = this.angularFirestorage.ref(name);

    uploadString(storageRef, capturedPhoto.dataUrl, 'data_url').then(() => {
      url.getDownloadURL().subscribe((url1: any) => {
        photo.pathFoto = url1;
        this.firestoreService.addPhoto(photo, type);
        this.utilSvc.presentToast({
          message: 'foto subida',
          duration:2000,
          color: 'success'
        })
        // this.authService.toast('Foto subida con exito', 'success');
      });
    });
  } // end of addNewToGallery
}
