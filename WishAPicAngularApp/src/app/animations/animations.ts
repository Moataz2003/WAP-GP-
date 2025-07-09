import { animate, state, style, transition, trigger } from '@angular/animations';

export const slideAnimation = trigger('slideAnimation', [
  state('login', style({ transform: 'translateX(0%)' })),
  state('register', style({ transform: 'translateX(-100%)' })),
  transition('login <=> register', [animate('0.5s ease-in-out')]),
]);
