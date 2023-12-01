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

  connect(ipAddress) {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this.socket = new WebSocket(`ws://${ipAddress}:3000`);
  
        this.socket.onopen = () => {
          this.connectionStatusSubscribers.forEach((subscriber) => subscriber(true));
          resolve(); // Resolve the promise when the connection is successful
        };
  
        this.socket.onclose = () => {
          this.connectionStatusSubscribers.forEach((subscriber) => subscriber(false));
          reject("Connection closed unexpectedly"); // Reject the promise if the connection closes unexpectedly
        };
  
        this.socket.onerror = (error) => {
          reject(error); // Reject the promise on any WebSocket error
        };
  
        this.socket.onmessage = (event) => {
          const message = event.data;
          console.log('Received WebSocket message:', message);
          this.sensorDataSubscribers.forEach((subscriber) => subscriber(message));
        };
      } else {
        resolve(); // Resolve the promise if already connected
      }
    });
  }

  close() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }
}

export default WebSocketService;