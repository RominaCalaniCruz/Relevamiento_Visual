import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';
import { Fotos } from '../models/fotos.model';
import { NavController } from '@ionic/angular';

interface Photo {
  url: string;
  category: string;
  owner:string;
}

@Component({
  selector: 'app-mis-fotos',
  templateUrl: './mis-fotos.page.html',
  styleUrls: ['./mis-fotos.page.scss'],
})
export class MisFotosPage implements OnInit {

  opcionSeleccionada : string = '';
  fotos: any[] = [];
  filteredPhotos: any[] = [];
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  idUser : string;
  isLoading = true;
  hayFotosLindas = false;
  hayFotosFeas = false;

  constructor(private navCtrl: NavController) { 
    this.idUser = this.utilsSvc.getLocalStorage('user').id;
  }

  ngOnInit() {
    this.getFotos();
  }
  goBack() {
    this.navCtrl.back();
  }
  segmentChanged(event: any){
    console.log(event?.target.value);
    this.opcionSeleccionada = event.target.value;
    this.filterPhotos(this.opcionSeleccionada);
    if(this.opcionSeleccionada == 'lindo' && this.filteredPhotos.length){
      this.hayFotosLindas = true;
    }
    else if(this.opcionSeleccionada == 'feo' && this.filteredPhotos.length){
      this.hayFotosFeas = true;
    }
    // if(this.filteredPhotos.length){
    //   this.hayFotosLindas = true;
    // }
  }
  // Método para filtrar fotos por categoría
  filterPhotos(category: string) {
    this.filteredPhotos = this.fotos.filter(photo => photo.categoria === category);
    
  }
  onImageLoad(photo: any) {
    photo.loading = false; // Detiene el spinner
    photo.imageLoaded = true; // Marca la imagen como cargada
  
    console.log("se cargo");
  }

  likePhoto(photo: Fotos) {
    console.log(`You liked ${photo.autor}'s photo!`);
  }
  async getFotos(){
    //codigo para ver fotos de X usuario
    this.idUser = this.utilsSvc.getLocalStorage('user').id;
    let path = `users/${this.idUser}/fotos`;
    const loading = await this.utilsSvc.loading();
    await loading.present();
    let sub = this.firebaseSvc.getCollectionData(path).subscribe((res: any[])=>{
      this.fotos = res.map((photo: any)=>({
        ...photo,
        loading: true,
        imageLoaded:false
      }));
      console.log(this.fotos);
      this.filterPhotos('lindo');
      loading.dismiss();
    });
  }
  verHome(){
    this.utilsSvc.routerLink("/home");
  }

}
