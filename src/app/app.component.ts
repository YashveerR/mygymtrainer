import { Component } from '@angular/core';
import {AuthService} from "../app/shared/auth.service"
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {MenuController} from "@ionic/angular"
import { UpdateService } from './shared/services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  selectedIndex: any;
  
  public appPages = [
    {
      title: 'Schedule',
      url: 'home/schedule',
      icon: 'calendar'
    },
    {
      title: 'Profile',
      url: 'home/mydetails',
      icon: 'construct'
    }

  ];
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public auth:AuthService,
    public menuCtrl: MenuController,
    public updates:UpdateService
  ) {
    this.initializeApp();
    this.updates.checkForUpdates();
  
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
   }

   ionViewDidEnter()
   {
    this.menuCtrl.enable(true);
   }
}
