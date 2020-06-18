import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore'
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  
  constructor(private firestore: AngularFirestore) { }

  createTrainer(name)
  {
    this.firestore.collection('trainer').doc(name).set({
      trainerName:name
    })
  }

  createAppointment(trainerId, data)
  {
    this.firestore.collection('trainer').doc(trainerId).collection('trainerSchedule').add(data);    
  }

  readUserData(doc_id)
  {
      return this.firestore.collection('users').doc(doc_id).get()
  }

  readAllTrainers(colId)
  {
    return this.firestore.collection(colId).get();
  }

  readTrainerSchedule(trainerId)
  {
    return this.firestore.collection('trainer').doc(trainerId).collection('trainerSchedule').get();
  }

  updateVerification(uid)
  {      
      this.firestore.collection('users').doc(uid).update({
          verifiedTrainer: true
      })
  }

  updateUserDetails({ recID, item, data }: { recID; item; data; })
  {
    switch (item)
    {
      case "name": {
        this.firestore.collection('users').doc(recID).update({
          displayName: data
        })
        break;
      }
      case "email":{
        this.firestore.collection('users').doc(recID).update({
          email: data
        })
        break;
      }
      case "phone":{
        this.firestore.collection('users').doc(recID).update({
          phoneNumber: data
        });
        break;
      }
      case "photo":{
        this.firestore.collection('users').doc(recID).update({
          photoURL: data
        })
        break;
      }
      default: break;
    }

  }
}
