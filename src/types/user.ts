export interface User {

  id: string;

  displayName: string;

  firstName: string;

  lastName: string;

  avatar?: {
    ref: string
  };
  bots: {
    tg: 'enabled' | 'disabled';
    fb: 'enabled' | 'disabled';
  };

  createdAt: string;

  locale: string;

  signUpPromo: boolean;
}
