/**
 * Left hand side of this enum should be equal as the list that
 * we have in the backend side.
 * Do not forget to keep it up to date.
 */
export enum VIEW_NAMES {
  MAIN = 'Main',
  HOME = 'Home',
  ADD_MEASUREMENT = 'Add',
  HISTORY = 'History',
  COMMUNITY = 'Community',
  PROFILE = 'Profile',
  ONBOARDING = 'Onboarding',
  WITHOUT_PREMIUM = 'WithoutPremium',
  MEDICAL_REPORT = 'MedicalReport',
  SIGN_IN = 'SignIn',
  SIGN_UP = 'SignUp',
  FORGOT_PASSWORD = 'ForgotPassword',
  NO_NETWORK = 'NoNetwork',
}

export type ViewName = keyof typeof VIEW_NAMES;
