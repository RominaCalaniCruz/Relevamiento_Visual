import { Component,OnInit, ViewChild, inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { User } from '../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { ModalController } from '@ionic/angular';
import { Fotos } from '../models/fotos.model';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  categoriaElegida : string = '';
  fotoPreview : string = '';
  fotoElegida : Fotos ={
    userID: '',
    url: '',
    categoria: '',
    autor: '',
    cantLikes: 0,
    fecha: Timestamp.fromDate(new Date()),
    arrayUsuarios: []
  };
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  user = {} as User;
  nombreUsuario : string = '';
  opciones = [
    { titulo: 'Inicio', icono: 'home', url: '/home' },
    { titulo: 'Fotos de cosas lindas', icono: 'star', url: '/votar-lindos' },
    { titulo: 'Fotos de cosas feas', icono: 'star-half', url: '/votar-feos' },
    { titulo: 'Mis fotos', icono: 'images', url: '/mis-fotos' },
    { titulo: 'Gráficos', icono: 'stats-chart', url: '/graficos' }
    // Agrega más opciones según sea necesario
  ];

  salir = false;
  ngOnInit() {
    this.user = this.utilsSvc.getLocalStorage('user');
    this.nombreUsuario = this.user.name;
    console.log(this.user);
    // this.fotoElegida.url = '';
  }
  constructor(public modalController: ModalController) {}
  
  verGraficos(){
    this.utilsSvc.routerLink("/graficos");
  }
  verHome(){
    this.utilsSvc.routerLink("/home");
  }
  verFotos(){
    this.utilsSvc.routerLink("/listado-fotos");
  }
  toggleMenu() {
    // Cerrar el menú después de navegar a una página
    document.querySelector('ion-menu-button').click();
  }
  imagenElegida = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required])
  });
  idUser : string;
  imagenLinda? : string;

  async tomarFoto(){
    const dataurl = (await this.utilsSvc.takePicture("Imagen del Edificio")).dataUrl;
    console.log(dataurl);
    this.fotoPreview = dataurl;
    // this.imagenElegida.controls.image.setValue(dataurl);
    // this.imagenLinda = dataurl;
  }
  setCategoria(categoria:string){
    this.categoriaElegida = categoria;
  }
  async guardarFoto(){
    this.idUser = this.utilsSvc.getLocalStorage('user').id;
    let path = `users/${this.idUser}/fotos`;
    
    const loading = await this.utilsSvc.loading();
    await loading.present();

    // let dataUrl = this.imagenElegida.value.image;

    let dataUrl = this.fotoPreview;
    
    let imagePath = `${this.idUser}/${Date.now()}`;

    let imageUrl = await this.firebaseSvc.uploadImage(imagePath,dataUrl);
    this.fotoElegida.userID = this.idUser;
    this.fotoElegida.categoria = this.categoriaElegida;
    this.fotoElegida.autor = this.utilsSvc.getLocalStorage('user').name;
    this.fotoElegida.cantLikes = 0;
    this.fotoElegida.fecha = Timestamp.fromDate(new Date());
    this.fotoElegida.arrayUsuarios = [];
    this.fotoElegida.url = imageUrl;
    // this.imagenElegida.controls.image.setValue(imageUrl);
    // this.imagenElegida.controls.name.setValue("foto_fea");
    console.log(this.imagenElegida.value);

    delete this.imagenElegida.value.id;
    this.firebaseSvc.addDocument(path,this.fotoElegida).then(async res =>{
      this.modalController.dismiss();
      this.imagenElegida.reset();
      this.fotoElegida.url = '';
      this.fotoPreview = '';
      this.utilsSvc.presentToast({
        
        message: "imagen subida",
        duration: 1000,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2000,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(()=>{
      loading.dismiss();
    });
  }
  limpiarFotoPreview() {
    this.fotoPreview = null;
  }
  async cerrarSesion(){
    // const loading = await this.utilsSvc.loading();
    // await loading.present();
    this.toggleMenu();
    this.utilsSvc.presentToast({
      message: '¡Hasta luego!',
      duration: 1500,
      color: 'primary',
      position: 'middle'
    });
    this.firebaseSvc.signOut();

  }
}

