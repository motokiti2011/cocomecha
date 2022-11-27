import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { loginUser } from 'src/app/entity/loginUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user$

  constructor() {
    this._user$ = new BehaviorSubject<loginUser | null>(null)
  }

  get user$() {
    return this._user$.asObservable()
  }

  login(user: loginUser) {
    this._user$.next(user)
  }

  logout() {
    this._user$.next(null)
  }
}
