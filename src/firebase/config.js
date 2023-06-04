import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDby8XJ7iqI85hDORinjaHvzv1JPVTfH3o",
    authDomain: "cooking-developers-site.firebaseapp.com",
    projectId: "cooking-developers-site",
    storageBucket: "cooking-developers-site.appspot.com",
    messagingSenderId: "160671432995",
    appId: "1:160671432995:web:7ac9cb643c76b26593cc96"
};

// init firebase
// bizi firebase backend'ine bağlar
firebase.initializeApp(firebaseConfig);

// init service
// firestore hizmetini başlatır
const firestoreObject = firebase.firestore();

export { firestoreObject }

