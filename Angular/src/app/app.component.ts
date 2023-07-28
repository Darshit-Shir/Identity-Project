import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as alertifyjs from 'alertifyjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userName:any;
  constructor(private router: Router){}
  title = 'demo_angular';
  IsMenuVisible = true;

  ngOnInit() {
    alertifyjs.set('notifier','position', 'top-right');   
  }
  ngDoCheck(): void {
    this.userName = localStorage.getItem('email');

    const currentRoute = this.router.url
    if(currentRoute == '/login' || currentRoute == '/register' || currentRoute == '/'){
      this.IsMenuVisible = false
    }
    else{
      this.IsMenuVisible = true
    }
  }
  logOut(){
    alertifyjs.success("Logged out successfully");
  }
}
