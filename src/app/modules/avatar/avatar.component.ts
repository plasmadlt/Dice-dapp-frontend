import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  // User name
  @Input() avatar: string;
  // Avatar url
  @Input() name: string;
  // Avatar diameter
  @Input() size: string | number;
  // Adds plasma marker
  @Input() isPlasma: boolean;

  constructor() {
    // Define default size
    this.size = 50;
  }

  getInitial() {
    if (this.name.length === 1) {
      return this.name.toUpperCase();
    }

    const names = this.name.split(' ');
    if (names.length === 1) {
      return `${names[0].slice(0, 1).toUpperCase()}${names[0].slice(1, 2).toLowerCase()}`;
    } else {
      return `${names[0].slice(0, 1).toUpperCase()}${names[1].slice(0, 1).toUpperCase()}`;
    }
  }
}
