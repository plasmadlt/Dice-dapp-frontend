import { Injectable } from '@angular/core';
import { NotifyInterface } from './notify.interface';
import { Subject } from 'rxjs';
import { v4 } from 'uuid';

@Injectable()
export class NotifyService {
  /// Popup on add emitter
  alertOnAdd: Subject<NotifyInterface> = new Subject<NotifyInterface>();
  // Popup on delete emitter
  alertOnDelete: Subject<string> = new Subject<string>();
  // Show alert time (default 15 seconds)
  showTime = 15000;
  // Max alerts count to screen
  maxAlertsCount = 5;

  constructor() { }

  /**
   * Show alert
   *
   * @return returns alert ID
   */
  showAlert(notify: NotifyInterface): string {
    notify._id = v4();
    this.alertOnAdd.next(notify);
    return notify._id;
  }

  /**
   * Hide alert
   */
  hideAlert(alertId: string): void {
    this.alertOnDelete.next(alertId);
  }

  /**
   * Show success alert
   * @param message - alert message
   * @param title - Title
   * @param showTime - Show time in milliseconds
   * @param code - Prevent the same popups, if have popup with same code, popup do not will show
   * @return alert id
   */
  alertSuccess(message: string, title: string = 'Success', showTime?: number, code?: string | number): string {
    return this.showAlert({type: 'success', title, message, showTime, code});
  }

  /**
   * Show danger alert
   * @param message - alert message
   * @param title - Title
   * @param showTime - Show time in milliseconds
   * @param code - Prevent the same popups, if have popup with same code, popup do not will show
   * @return alert id
   */
  alertDanger(message: string, title: string = 'Error', showTime?: number, code?: string | number): string {
    return this.showAlert({type: 'danger', title, message, showTime, code});
  }

  /**
   * Show info alert
   * @param message - alert message
   * @param title - Title
   * @param showTime - Show time in milliseconds
   * @param code - Prevent the same popups, if have popup with same code, popup do not will show
   * @return alert id
   */
  alertInfo(message: string, title: string = 'Info', showTime?: number, code?: string | number): string {
    return this.showAlert({type: 'info', title, message, showTime, code});
  }
}
