import * as functions from 'firebase-functions';
import { sha256} from 'js-sha256';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const admin = require('firebase-admin');
admin.initializeApp();

 export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });

 // Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.
exports.addMessage = functions.https.onCall((data, context) => {
    const text = data.text;
    let text2:string = data.text;
// Authentication / user information is automatically added to the request.
    const uid = context.auth?.uid;
    let name1:string = context.auth?.uid!;
    console.log("new data received", text, uid, sha256(name1), text2)
    let text3:string = sha256(name1);
    if (text2.trim() === text3.trim())
    {
        return { text: "values match"};
    }
    else{
        console.log("main error");
        return { text: "error not depositing in DB" };
    }
  });