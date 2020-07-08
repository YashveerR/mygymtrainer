import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastController  } from '@ionic/angular';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(public updates: SwUpdate, 
    public toastController: ToastController) { 
 
    interval(300000).subscribe(() => updates.checkForUpdate()
          .then(() => console.log('checking for updates')));
  
   /* this.updates.available.subscribe(event => {
      this.showAppUpdateAlert();
    });*/

  }

  checkForUpdates()
  {
    this.updates.available.subscribe(event => {
      console.log("app versions", event.current, event.available)
      this.showAppUpdateAlert();
    });
  }

 async showAppUpdateAlert() {
    const header = 'App Update available';
    const message = 'Choose Ok to update';
    const action = this.doAppUpdate;
    const caller = this;
    // Use MatDialog or ionicframework's AlertController or similar
    const alert = await this.toastController.create({
      header: header,
      message: message,
      position: 'bottom',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Reload',
          handler: () => {
            window.location.reload();
          },
        },
      ],
    });
    await alert.present();
  }
  
  doAppUpdate() {
      this.updates.activateUpdate().then(() => document.location.reload());
    }
}
