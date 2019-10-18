import { Injectable } from '@angular/core';

@Injectable()
export class AudioService {
  // Win sound
  private _win: HTMLAudioElement;
  // Lose sound
  private _lose: HTMLAudioElement;

  constructor() {
    this._win = new Audio('./assets/sound/win.mp3');
    this._lose = new Audio('./assets/sound/lose.mp3');
  }

  win(): void {
    this._win.play();
  }

  lose(): void {
    this._lose.play();
  }
}
