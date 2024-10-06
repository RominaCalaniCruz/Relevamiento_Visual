import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { getFirestore, setDoc , doc , getDoc, addDoc, collection, collectionData, query} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword , updateProfile} from 'firebase/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage';
import { Observable, from, map, mergeMap, toArray } from 'rxjs';
import { Fotos } from '../models/fotos.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  constructor() {
  }


  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);

  async loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(getAuth(), email, password);

  }
  

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  //login
  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email,user.password);
  }
  
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(),path),data);

  }
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(),path),data);

  }
  
  async uploadImage(path:string, data_url: string){
    return uploadString(ref(getStorage(),path),data_url, 'data_url').then(()=>{
      return getDownloadURL(ref(getStorage(),path));
    });
  }

  // async resetPassword(email: string) {
  //   return await this.ngFireAuth.sendPasswordResetEmail(email);

  // }
  // async getProfile():Promise <User | null> {
  //   return new Promise<User | null>((resolve, reject) => {
  //     this.ngFireAuth.onAuthStateChanged(user => {
  //       if (user) {
  //         resolve(user as User);
  //       } else {
  //         resolve(null);
  //       }
  //     }, reject);
  //   })
  // }

  getCollectionData(path: string , collectionQuery?: any){
    const ref = collection(getFirestore(),path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'});
  }
//obtener ruta de la imagen con su url
  getFilePath(url: string){
    return ref(getStorage(), url).fullPath;
  }

  getAllFotos(){
    // return this.firestore.collectionGroup('fotos', ref => ref.orderBy('fecha','desc')).valueChanges();
    return this.firestore.collectionGroup('fotos').valueChanges();

  }
  traertTodasLasFotos(): Observable<any[]> {
    return this.firestore.collection('users').snapshotChanges().pipe(
      mergeMap(users => {
        const photoObservables = users.map(user => {
          const userId = user.payload.doc.id;
          return this.firestore.collection(`users/${userId}/fotos`).snapshotChanges().pipe(
            map(fotos => fotos.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, userId, ...data };
            }))
          );
        });
        return from(photoObservables).pipe(mergeMap(obs => obs), toArray());
      }),
      map(photoArrays => photoArrays.flat())
    );
  }
  getColleciondeTodasFotos(tipo: any): Observable<any> {
    return this.firestore
      .collectionGroup<Fotos>('fotos', (ref) =>
        ref.where('categoria', '==', tipo).orderBy('fecha', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Fotos; // Obtén los datos del documento
            //console.log('Datos del doducmento:', data);
            const id = a.payload.doc.id; // Obtén el ID del documento
            //console.log('Obtengo el id del documento:', id);
            return { ...data, id }; // Combina el ID y los datos en un solo objeto
          })
        )
      );
  }
  updateUser(id: string, data: any) {
    return this.firestore.collection('users').doc(id).update(data);
  }
  updatePhotoData(userID: string, photoID: string, newData: any): Promise<void> {
    // Obtener referencia al documento del usuario
    const userDocRef = this.firestore.collection('users').doc(userID);

    // Actualizar documento de la foto dentro de la colección del usuario
    const photoDocRef = userDocRef.collection('fotos').doc(photoID);

    // Realizar la actualización de datos
    return photoDocRef.update(newData);
  }
}
