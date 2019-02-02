import {Component, OnInit} from '@angular/core';

import {catchError} from "rxjs/operators";
import {System} from "../../system/System";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  password: string="gegengift";
  password2: string;
  email: string="christian.huber@groovybytes.at";

  constructor(private auth:AuthenticationService,private system:System) {
  }

  ngOnInit() {
  }

  submit(): void {
    this.auth.register(this.email,this.password,this.password2)
      .then(result=>{
        result.user.token=result.token;
        this.auth.user=result.user;
      })
      .catch(error => this.system.error(error));
  }

}
