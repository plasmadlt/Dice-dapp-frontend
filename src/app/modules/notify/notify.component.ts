import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, keyframes, query, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { NotifyInterface } from './notify.interface';
import { NotifyService } from './notify.service';

@Component({
  selector: 'app-notify-component',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
  animations: [
    trigger('alerts', [
      state('void', style({'margin-top': '0'})),
      transition('* => void', [
        animate(400, keyframes([
          style({opacity: 1, transform: 'translateX(0)', offset: 0}),
          style({opacity: 1, transform: 'translateX(-15px)', offset: 0.5}),
          style({opacity: 0, transform: 'translateX(100%)', offset: 0.7}),
          style({height: 0, padding: 0, offset: 1.0})
        ]))
      ]),
      transition('void => *', [
        query('.alert-block', [
          animate(150, keyframes([
            style({'margin-top': '-100%', offset: 0}),
            style({'margin-top': '0%', offset: 1.0})
          ]))
        ]),
        animate(50, keyframes([
          style({'margin-top': '0', offset: 0}),
          style({'margin-top': '16px', offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class NotifyComponent implements OnInit, OnDestroy {
  // Alerts
  alerts: NotifyInterface[];
  // All subscriptions of component
  private $subscriptions: Subscription = new Subscription();

  constructor(
    private notify: NotifyService
  ) {
    this.alerts = [];
  }

  /**
   * Component init handler
   */
  ngOnInit(): void {
    // Subscribe to on add popup
    const sub1 = this.notify.alertOnAdd.subscribe(popup => {
      // Prevent pop-up with the same code
      if (popup.code && this.alerts.some(i => i.code === popup.code)) {
        return;
      }

      // Add popup
      this.alerts.push(popup);

      // Start popup delete timer
      if (popup.showTime !== 0) {
        setTimeout((popupId => () => this.hideAlert(popupId))(popup._id), popup.showTime || this.notify.showTime);
      }

      // Delete extra popups
      if (this.alerts.length > this.notify.maxAlertsCount) {
        this.alerts.shift();
      }
    });
    // Subscribe to on delete popup
    const sub2 = this.notify.alertOnDelete.subscribe(popupId => this.hideAlert(popupId));

    this.$subscriptions.add(sub1).add(sub2);
  }

  /**
   * To destroy component handler
   */
  ngOnDestroy(): void {
    this.$subscriptions.unsubscribe();
  }

  /**
   * Hide alert
   */
  hideAlert(alertId: string): void {
    for (let i = 0; i < this.alerts.length; i++) {
      if (this.alerts[i]._id === alertId) {
        this.alerts.splice(i, 1);
        break;
      }
    }
  }
}
