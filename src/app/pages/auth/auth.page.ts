import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  // email!: string;
  // password!: string;

  // loginForm: FormGroup;

  // constructor(private formBuilder: FormBuilder) {
  //   this.loginForm = this.formBuilder.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required, Validators.minLength(6)]],
  //   });
  // }

  // ngOnInit() {
  // }

  // // Aquí puedes agregar métodos para manejar el envío del formulario
  // onSubmit() {
  //   console.log('Email:', this.email);
  //   console.log('Password:', this.password);
  //   // Aquí puedes agregar la lógica para enviar los datos al servidor
  // }

  ionicForm!: FormGroup;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  // email:any
  // password:any
  // contact:any

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', [
        // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
        Validators.required,
      ]
      ],
    });
  }

  async login(){
    if(this.ionicForm.valid){
      const loading = await this.utilsSvc.loading();
      await loading.present();
      this.firebaseSvc.signIn(this.ionicForm.value as User).then(res=>{
        console.log(res);

        this.getUserInfo(res.user.uid);

      }).catch(err=>{
        console.log(err);
        this.utilsSvc.presentToast({
          message: "El usuario no existe",
          duration: 2000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(()=>{
        loading.dismiss();
      })
    }
    console.log(this.ionicForm.value);
  }

  async getUserInfo(userId: string){
    if(this.ionicForm.valid){
      const loading = await this.utilsSvc.loading();
      await loading.present();
      let path = `users/${userId}`;
      this.firebaseSvc.getDocument(path).then( (user: any)=>{
        if(user!==null){

          this.utilsSvc.guardarEnLocalStorage('user', user);
          this.utilsSvc.routerLink('/home');
          this.ionicForm.reset();
  
          this.utilsSvc.presentToast({
            message: `¡Bienvenid@ ${user.name}!`,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline'
          });
        }
        console.log(user);


      }).catch(err=>{
        console.log(err);
        this.utilsSvc.presentToast({
          message: "Error al registrarse",
          duration: 2000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(()=>{
        loading.dismiss();
      })
    }
    console.log(this.ionicForm.value);
  }
  autocomplete(email:string, pass:string){
    this.ionicForm.get('email')?.setValue(email);
    this.ionicForm.get('password')?.setValue(pass);
  }
  borrar(){
    this.ionicForm.get('email')?.setValue("");
    this.ionicForm.get('password')?.setValue("");
  }

}
