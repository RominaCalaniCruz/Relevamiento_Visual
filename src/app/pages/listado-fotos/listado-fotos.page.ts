import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-listado-fotos',
  templateUrl: './listado-fotos.page.html',
  styleUrls: ['./listado-fotos.page.scss'],
})
export class ListadoFotosPage implements OnInit {

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  opcionSeleccionada : string = '';
  fotos: any[] = [];
  filteredPhotos: any[] = [];
  idUser : string;
  isLoading = true;
  hayFotosLindas = false;
  hayFotosFeas = false;

  constructor(private navCtrl: NavController) { 
    this.idUser = this.utilsSvc.getLocalStorage('user').id;
  }

  ngOnInit() {
  }

  user(): User{
    return this.utilsSvc.getLocalStorage('user');
  }

  ionViewWillEnter(){
    this.getFotos();
  }




  verHome(){
    this.utilsSvc.routerLink("/home");
  }
  goBack() {
    this.navCtrl.back();
  }
  getFotos(){
    //codigo para ver fotos de X usuario
    // let path = `users/${this.user().id}/fotos`;
    // let sub = this.firebaseSvc.getCollectionData(path).subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //     sub.unsubscribe();
    //   }
    // })
    this.firebaseSvc.getAllFotos().subscribe((fotos)=>{
      this.fotos = fotos;
    })
  }
}
