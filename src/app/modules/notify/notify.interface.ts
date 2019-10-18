export interface NotifyInterface {
  // Alert id
  _id?: string;
  // Type
  type: 'success' | 'info' | 'danger';
  // Alert title
  title: string;
  // Alert message
  message: string;
  // Show time in ms
  showTime?: number;
  // Prevent the same popups, if have popup with same code, popup do not will show
  code?: string | number;
}
