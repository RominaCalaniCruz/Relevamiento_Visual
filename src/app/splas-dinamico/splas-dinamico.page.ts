import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splas-dinamico',
  templateUrl: './splas-dinamico.page.html',
  styleUrls: ['./splas-dinamico.page.scss'],
})
export class SplasDinamicoPage implements OnInit {

  constructor(public router:Router) { 
    setTimeout(()=>{
      this.router.navigateByUrl('auth');
    },2000);
  }

  ngOnInit() {
  }

}
