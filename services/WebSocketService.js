class WebSocketService {
  static instance = null;
  socket = null;
  connectionStatusSubscribers = [];
  sensorDataSubscribers = [];

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  subscribeToConnectionStatus(subscriber) {
    this.connectionStatusSubscribers.push(subscriber);
  }

  unsubscribeFromConnectionStatus(subscriber) {
    this.connectionStatusSubscribers = this.connectionStatusSubscribers.filter((s) => s !== subscriber);
  }

  subscribeToSensorData(subscriber) {
    this.sensorDataSubscribers.push(subscriber);
  }

  unsubscribeFromSensorData(subscriber) {
    this.sensorDataSubscribers = this.sensorDataSubscribers.filter((s) => s !== subscriber);
  }

  connect(hostname) {
    // Ensure the hostname is not empty or null
    // if (!hostname) {
    //   // Show an alert for an invalid hostname
    //   alert('Invalid hostname. Please enter the correct Hostname.');
    //   return; // Exit the method to prevent further execution
    // }

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(`ws://${hostname}.local:3000`);

      this.socket.onopen = () => {
        this.connectionStatusSubscribers.forEach((subscriber) => subscriber(true));
      };

      this.socket.onclose = () => {
        this.connectionStatusSubscribers.forEach((subscriber) => subscriber(false));
      };

      this.socket.onmessage = (event) => {
        const message = event.data;
        console.log('Received WebSocket message:', message);
        this.sensorDataSubscribers.forEach((subscriber) => subscriber(message));
      };
    }
  }

  close() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      this.socket.close();
    }
  }
}

export default WebSocketService;