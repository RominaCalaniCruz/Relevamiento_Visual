import { Component, OnInit , inject} from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { FirebaseService } from '../../services/firebase.service';
import { Fotos } from '../../models/fotos.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { Fireworks } from 'fireworks-js';

@Component({
  selector: 'app-votar-lindos',
  templateUrl: './votar-lindos.page.html',
  styleUrls: ['./votar-lindos.page.scss'],
})
export class VotarLindosPage implements OnInit {
  opcionSeleccionada : string = '';
  fotos: any[] = [];
  filteredPhotos: any[] = [];
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  idUser : string;
  isLoading = true;
  // currentUser = ''; 
  constructor(private navCtrl: NavController,private firestore: AngularFirestore) { 
    this.idUser = this.utilsSvc.getLocalStorage('user').id;
    
  }

  ngOnInit() {
    // this.getFotos();
    // this.traerTodo();
    this.traerLindos();
  }
  goBack() {
    this.navCtrl.back();
  }
  segmentChanged(event: any){
    console.log(event?.target.value);
    this.opcionSeleccionada = event.target.value;
    this.filterPhotos(this.opcionSeleccionada);
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

  likePhoto(photo: any) {
    // this.idUser = this.utilsSvc.getLocalStorage('user').id;
    // const path = `users/${this.idUser}/fotos/${photo.id}`;
    // const newLikes = photo.cantLikes + 1;
    // this.firestore.doc(path).update({
    //   cantLikes: newLikes,
    //   arrayUsuarios: firebase.firestore.FieldValue.arrayUnion(user.name)
    // }).then(() => {
    //   console.log(`You liked ${photo.autor}'s photo!`);
    // }).catch((error) => {
    //   console.error("Error updating document: ", error);
    // });
    this.idUser = this.utilsSvc.getLocalStorage('user').id;
    if (!photo.arrayUsuarios.includes(this.idUser)) {
      photo.arrayUsuarios.push(this.idUser);
      photo.cantLikes++;
      console.log(this.fotos);
      this.startFireworks(photo.id);
      console.log(`You liked ${photo.autor}'s photo!`);
      console.log(`You liked ${photo.id}'s photo!`);
      const newData = {
        cantLikes: photo.cantLikes, // Nuevo valor de cantLikes
        arrayUsuarios: photo.arrayUsuarios // Nuevo array de usuarios
      };
      this.firebaseSvc.updatePhotoData(photo.userID,photo.id,newData)
      .then(()=>{
        console.log("se actualizo en bd");
      })
      .catch(()=>{
        console.log("error");
        
      });
    }
    
  }

  unlikePhoto(photo) {
    const index = photo.arrayUsuarios.indexOf(this.idUser);
    if (index > -1) {
      photo.arrayUsuarios.splice(index, 1);
      photo.cantLikes--;
      console.log(this.fotos);

      console.log(`You disliked ${photo.autor} photo!`);
      console.log(`You disliked ${photo.id} photo!`);
      
      const newData = {
        cantLikes: photo.cantLikes, // Nuevo valor de cantLikes
        arrayUsuarios: photo.arrayUsuarios // Nuevo array de usuarios
      };
      this.firebaseSvc.updatePhotoData(photo.userID,photo.id,newData)
      .then(()=>{
        console.log("se actualizo en bd");
      })
      .catch(()=>{
        console.log("error");
        
      });
    }
  }
  startFireworks(id: string) {
    const container = document.getElementById(`fireworks-container-${id}`);
  if (container) {
    // Limpiar cualquier instancia anterior de fuegos artificiales
    container.innerHTML = '';
      const fireworks = new Fireworks(container, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 1,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 2,
        intensity: 10,
        flickering: 50,
        lineStyle: 'round',
        hue: {
          min: 0,
          max: 360
        },
        delay: {
          min: 0.015,
          max: 0.03
        },
        rocketsPoint: {
          min: 50,
          max: 50
        },
        lineWidth: {
          explosion: {
            min: 1,
            max: 3
          },
          trace: {
            min: 1,
            max: 2
          }
        },
        brightness: {
          min: 50,
          max: 80
        },
        decay: {
          min: 0.015,
          max: 0.03
        },
        mouse: {
          click: false,
          move: false,
          max: 1
        }
      });
      fireworks.start();

      // Detener los fuegos artificiales después de 3 segundos
      setTimeout(() => fireworks.stop(), 1500);
    }
  }

  async getFotos(){
    const loading = await this.utilsSvc.loading();
    await loading.present();
    this.firebaseSvc.getAllFotos().subscribe((res: any[])=>{
      this.fotos = res.map((photo: any)=>({
        ...photo,
        loading: true,
        imageLoaded:false,
        fechaFormateada: this.formatTimestamp(photo.fecha)
      }));

      this.fotos.sort((a, b) => {
        const dateA = new Date(a.fecha.seconds * 1000);
        const dateB = new Date(b.fecha.seconds * 1000);
        return dateB.getTime() - dateA.getTime();
      });

      console.log(this.fotos);
      this.filterPhotos('lindo');
      loading.dismiss();
    });
  }

  async traerLindos(){
    const loading = await this.utilsSvc.loading();
    await loading.present();
    this.firebaseSvc.getColleciondeTodasFotos('lindo').subscribe((res:any[]) => {
      this.fotos = res.map((photo: any) => ({
        ...photo,
        loading: true,
        imageLoaded: false,
        fechaFormateada: this.formatTimestamp(photo.fecha)
      }));
      console.log(this.fotos );
      // this.filterPhotos('lindo');
      loading.dismiss();
    });
    // loading.dismiss();
  }


  async traerTodo() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.traertTodasLasFotos().subscribe((res:any[]) => {
      const fotitos = res.map((photo: any) => ({
        ...photo,
        loading: true,
        imageLoaded: false,
        fechaFormateada: this.formatTimestamp(photo.fecha)
      }));

      // fotitos.sort((a, b) => {
      //   const dateA = new Date(a.fecha.seconds * 1000);
      //   const dateB = new Date(b.fecha.seconds * 1000);
      //   return dateB.getTime() - dateA.getTime();
      // });
      console.log(fotitos);
      // this.filterPhotos('lindo');
      loading.dismiss();
    });
    loading.dismiss();
  }

  verHome(){
    this.utilsSvc.routerLink("/home");
  }
  formatTimestamp(timestamp: Timestamp | undefined): string {
    if (!timestamp) {
      return ''; // Devolver una cadena vacía si el timestamp es undefined
    }
  
    // Convertir el Timestamp en un objeto Date
    const date = timestamp.toDate();
    // Obtener los componentes de la fecha
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Añade un cero al principio si es necesario
  const day = date.getDate().toString().padStart(2, '0'); // Añade un cero al principio si es necesario
  const hours = date.getHours().toString().padStart(2, '0'); // Añade un cero al principio si es necesario
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Añade un cero al principio si es necesario
  // Formatear la fecha en una cadena legible
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
  return formattedDate;
  }
}
