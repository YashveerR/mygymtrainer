import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions'
import {AngularFirestore} from '@angular/fire/firestore'
import { AlertController } from '@ionic/angular';

import {CrudService} from '../../shared/services/crud.service'
import { sha256, sha224 } from 'js-sha256';

@Component({
  selector: 'app-mydetails',
  templateUrl: './mydetails.page.html',
  styleUrls: ['./mydetails.page.scss'],
})
export class MydetailsPage implements OnInit {

  photo: SafeResourceUrl;

  user_name: any;
  user_lastName:any;
  user_email:any;  
  userNumber: any;
  verifiedTrainer:any;

  userdata: any;

  photoChanged : boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private crud:CrudService,
    public alertController: AlertController
    ) { }

  ngOnInit() {
    this.read_user();


  }

  doRefresh(events)
  {
    
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.photoChanged = true;
  }

 async read_user()
  {
  
    
    this.userdata = JSON.parse(localStorage.getItem('user'));
    console.log("USER DATDA",this.userdata);     
    
    console.log(sha256(this.userdata["uid"]));

    this.crud.readUserData(this.userdata["uid"]).subscribe(data =>{

      var userNameSplit = data.data()['displayName'];
      var splitted  = userNameSplit.split(" ", 2);      
      this.user_name = splitted[0];
      this.user_lastName = splitted[1];
      this.photo = data.data()['photoURL'];
      this.user_email = data.data()['email'];
      this.userNumber = data.data()['phoneNumbers']
      this.verifiedTrainer = data.data()['verifiedTrainer'];
      })

  }

  //think of smarter way to do this, later.....
  updateInformation(userName, lastName, email, phone)
  {
    //based on the information store these and extra fields to firebase
    //lets not create more writes when they are not necessary
    if(this.userdata["displayName"] != (userName + " " + lastName))
    {
      //issue the crud to change the name
      console.log("cloud and data do not match for name", this.userdata["displayName"], (userName + " " + lastName) );
      this.crud.updateUserDetails({ recID: this.userdata["uid"], item: "name", data: (userName + " " + lastName) });
    }
    if (this.userdata["email"] != email)
    {
      //issue the crud to update the email
      console.log("cloud and data do not match for email", this.userdata["email"], email);
      this.crud.updateUserDetails({ recID: this.userdata["uid"], item: "email", data: email });
    }
    if (this.userdata["phoneNumber"] != phone)
    {
      console.log("cloud and data do not match for number", this.userdata["phoneNumber"], phone);
      this.crud.updateUserDetails({ recID: this.userdata["uid"], item: "phone", data: phone });
    }
    if (this.photoChanged == true)
    {
      //issue the CRUD to update the photo
      console.log("cloud and data do not match for photo");
      this.crud.updateUserDetails({ recID: this.userdata["uid"], item: "photo", data: this.photo }); //JUST CHECK THIS
    }
  }

  callCloudVerification(codify)
  {
    return firebase.functions().httpsCallable('addMessage')({text: sha256(codify)}).
    then(function(result) {
      // Read result of the Cloud Function.
        return result
    });        
  }

  async verification(secret)
  {  
      const result = await this.callCloudVerification(secret);
      console.log(result.data);
      if (result.data['text'] === "values match")
      {
        this.crud.updateVerification(this.userdata["uid"]);
        this.verifiedTrainer = true; //only done once, thereafter the promise above will sort this out
        this.crud.createTrainer(this.userdata["displayName"]);
      }
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Enter Secret Trainer Key',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Placeholder 1'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {
            this.verification(data.name1);
            console.log('Confirm Ok', data.name1 );
          }
        }
      ]
    });

    await alert.present();
  }
}
