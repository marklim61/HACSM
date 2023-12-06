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

  onMessageHandler(event) {
    const message = event.data;
    console.log('Received WebSocket message:', message);

    // Check if WebSocket is connected before notifying subscribers
    if (this.isConnected()) {
      this.sensorDataSubscribers.forEach((subscriber) => subscriber(message));
    }
  }

  connect(hostname) {
    try{
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this.socket = new WebSocket(`ws://${hostname}.local:81`);
  
        this.socket.onopen = () => {
          this.connectionStatusSubscribers.forEach((subscriber) => subscriber(true));
        };
  
        this.socket.onclose = () => {
          this.connectionStatusSubscribers.forEach((subscriber) => subscriber(false));
        };
  
        this.socket.onmessage = this.onMessageHandler.bind(this);
      }
    } catch (error) {
    console.error('WebSocket connection error:', error);
    }
  }

  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  close() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      this.socket.close();
    }
  }

  sendMessage(message) {
    if (this.isConnected()) {
      this.socket.send(message);
      console.log('Sending message:', message);
    } else {
      console.error('WebSocket is not connected. Cannot send message.');
    }
  }
}

export default WebSocketService;