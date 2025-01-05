#!/usr/bin/env python3
import websocket
import json
import rel

def on_message(ws, message):
    print(f"Received price update: {message}")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("WebSocket connection closed")

def on_open(ws):
    print("Connected to websocket server")
    subscribe_message = {
        "type": "prices.subscribe",
        "payload": {
            "currency": "BTC"
        }
    }
    ws.send(json.dumps(subscribe_message))
    print("Subscribed to BTC price updates")

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://localhost:5201",
                              on_message=on_message,
                              on_error=on_error,
                              on_close=on_close,
                              on_open=on_open)
    
    ws.run_forever(dispatcher=rel)
    rel.signal(2, rel.abort)  # Keyboard Interrupt
    rel.dispatch() 