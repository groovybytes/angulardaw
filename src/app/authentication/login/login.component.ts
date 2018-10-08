
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { System } from "../../system/System";
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email:string="chris";
  password:string="password";

  constructor(  private route: Router,private auth:AuthenticationService,private system:System) {
  }

  ngOnInit() {
  }

  submit(): void {
    this.auth.login(this.email,this.password)
      .subscribe(response=>{
        if (response.success){
          localStorage.setItem('token', response.token);
          this.route.navigate(['/welcome']);
        }
        else{
          //todo: failed
        }

      },error=>this.system.error(error));


   /* if (user) {
      // store user details and basic auth credentials in local storage
      // to keep user logged in between page refreshes
      user.authdata = window.btoa(email + ':' + password);
      localStorage.setItem('currentUser', JSON.stringify(user));*/


  }
}
