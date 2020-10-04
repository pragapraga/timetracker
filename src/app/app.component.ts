import {Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges {

  auth2: any;
  username: string;
  name: string;
  isLoggedIn: boolean;

  @ViewChild('loginRef', {static: true }) loginElement: ElementRef;

  constructor() { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.googleSDK();

    this.username = localStorage.getItem('name');
    console.log("Username", this.username);
    if (this.username == null) {
      this.isLoggedIn = true;
      this.logout();
    } else {
      this.isLoggedIn = false;
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.prepareLoginButton();
  }

  // tslint:disable-next-line:typedef
  prepareLoginButton() {
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {

        const profile = googleUser.getBasicProfile();
        this.username = profile.getEmail();
        this.isLoggedIn = true;

        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());

        localStorage.setItem('token', googleUser.getAuthResponse().id_token);
        localStorage.setItem('name', profile.getName());

      }, (error) => {
        console.log('Error.....', error);
      });
  }

  // tslint:disable-next-line:typedef
  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
  }

  // tslint:disable-next-line:typedef
  googleSDK() {
    // @ts-ignore
    window.googleSDKLoaded = () => {
      // @ts-ignore
      window.gapi.load('auth2', () => {
        // @ts-ignore
        this.auth2 = window.gapi.auth2.init({
          client_id: '687210100683-2fp13lfmfo3fv2mmrfvahrr19esm4t1s.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLoginButton();
      });
    };

    // tslint:disable-next-line:only-arrow-functions
    (function(d, s, id){
      // tslint:disable-next-line:prefer-const one-variable-per-declaration
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return; }
      js = d.createElement(s); js.id = id;
      js.src = 'https://apis.google.com/js/platform.js?onload=googleSDKLoaded';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));

  }

}
