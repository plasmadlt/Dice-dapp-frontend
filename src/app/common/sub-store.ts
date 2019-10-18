import { Subscription } from 'rxjs';

export function SubStoreDecorator(constructor) {

  const ngOnDestroy = constructor.prototype.ngOnDestroy;
  const ngOnInit = constructor.prototype.ngOnInit;

  constructor.prototype.ngOnInit = function () {
    // tslint:disable-next-line: no-use-before-declare
    this._subStore = new SubStore();
    if (ngOnInit && typeof ngOnInit === 'function') {
      ngOnInit.apply(this, arguments);
    }
  };

  constructor.prototype.ngOnDestroy = function () {
    if (this._subStore) {
      this._subStore.destroy();
    }

    if (ngOnDestroy && typeof ngOnDestroy === 'function') {
      ngOnDestroy.apply(this, arguments);
    }
  };
}

export class SubStore {

  private $subscriptions: Subscription;

  constructor() {
    this.$subscriptions = new Subscription();
  }

  /**
   * Delete all subscriptions
   */
  destroy(): void {
    this.$subscriptions.unsubscribe();
  }

  /**
   * Add new subscription
   */
  set sub(subscription: Subscription) {
    this.$subscriptions.add(subscription);
  }
}
