import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import analytics from '@react-native-firebase/analytics';

GoogleSignin.configure({
  webClientId: Config.FIREBASE_WEBCLIENT_ID,
});

const AuthService = class AuthService {
  signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential | void> {
    return GoogleSignin.signIn()
      .then(({ idToken }) => {
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
      })
      .catch(async (error) => {
        await analytics().logEvent('sign_in_with_google_error', error);
      });
  }

  signUpWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<FirebaseAuthTypes.UserCredential | void> {
    return auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(async (error) => {
        await analytics().logEvent(
          'sign_up_with_email_and_password_error',
          error
        );
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('El correo eléctronico está en uso.');
        }
        if (error.code === 'auth/invalid-email') {
          throw new Error('Dirección de correo electronico inválida.');
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
