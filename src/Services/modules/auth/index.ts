import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

GoogleSignin.configure({
  webClientId: Config.FIREBASE_WEBCLIENT_ID,
});

const AuthService = class AuthService {
  signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
    return GoogleSignin.signIn().then(({ idToken }) => {
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    });
  }

  signUpWithEmailAndPassword(
    name: string,
    email: string,
    password: string
  ): Promise<FirebaseAuthTypes.UserCredential | void> {
    // TODO: We need to call our diabunity API to create a new user
    return auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('Email already in use');
        }
        if (error.code === 'auth/invalid-email') {
          throw new Error('That email address is invalid!');
        }
      });
  }

  signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<FirebaseAuthTypes.UserCredential> {
    return auth().signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return auth().signOut();
  }

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return auth().sendPasswordResetEmail(email);
  }
};

export default new AuthService();
