import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfiguration} from "../app.configuration";
import {RegisterResponseDto} from "./register.response.dto";
import {User} from "./User";
import {map} from "rxjs/operators";

@Injectable()
export class AuthenticationService {

  user:User;

  constructor(private http: HttpClient,private configuration:AppConfiguration) {

  }

  register(email: string, password: string, password2: string): Promise<RegisterResponseDto> {
    return this.http.post<RegisterResponseDto>(this.configuration.getUrl("users"), {
      email: email,
      password: password,
      access_token:"uDohyaWjMnpphGSlBA6qfQK0ziV5RMDP"
    }).toPromise();
  }

  login(email: string, password: string) {

    const body = new HttpParams()
      .set('name', email)
      .set('password', password);

    let headers_object = new HttpHeaders();
    headers_object= headers_object.append("Content-Type", "application/x-www-form-urlencoded");

    const httpOptions = {
      headers: headers_object
    };

    return this.http.post<any>(this.configuration.getUrl("authenticate"),
      body.toString(),
      httpOptions);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  login2(email: string, password: string): Promise<RegisterResponseDto> {

    let headers_object = new HttpHeaders();
    headers_object.append('Content-Type', 'application/x-www-form-urlencoded');
    headers_object.append("Authorization", "Basic " + btoa(email+":"+password));

    const httpOptions = {
      headers: headers_object
    };

    return this.http.post<RegisterResponseDto>(this.configuration.getUrl("auth"), {
      access_token:"uDohyaWjMnpphGSlBA6qfQK0ziV5RMDP"
    },httpOptions).toPromise();
  }


}
