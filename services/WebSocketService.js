class WebSocketService {
  static instance = null;
  socket = null;  //Websocket connection
  connectionStatusSubscribers = []; // Subscribers for connection status changes
  sensorDataSubscribers = []; //Subscribers for sensor data updates

  //Singleton pattern: ensure that only 1 instance of the 'WebSocketService' is created
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

  // Handle incoming WebSocket messages
  onMessageHandler(event) {
    const message = event.data;
    console.log('Received WebSocket message:', message);

    // Check if WebSocket is connected before notifying subscribers
    if (this.isConnected()) {
      this.sensorDataSubscribers.forEach((subscriber) => subscriber(message));
    }
  }

  // Establish websocket connection
  connect(hostname) {
    try{
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this.socket = new WebSocket(`ws://${hostname}.local:81`); // Create a new websocket connection
  
        this.socket.onopen = () => {
          this.connectionStatusSubscribers.forEach((subscriber) => subscriber(true));
        };
  
        this.socket.onclose = () => {
          this.connectionStatusSubscribers.forEach((subscriber) => subscriber(false));
        };
  
        // Handler for incoming messages
        this.socket.onmessage = this.onMessageHandler.bind(this);
      }
    } catch (error) {
    console.error('WebSocket connection error:', error);
    }
  }

  // Check if websocket is currently connected
  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  // Close websocket connection
  close() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      this.socket.close();
    }
  }

  // Send a message to our HACSM main unit through websocket
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