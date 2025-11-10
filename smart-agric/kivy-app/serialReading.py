import serial
import json
import time
from datetime import datetime

SERIAL_PORT = '/dev/ttyUSB0'  # Update with your serial port ttyACM0 for Linux or COM3 for Windows
BAUD_RATE = 9600

def find_arduino_port():
    """Try to automatically fine the Arduino serial port."""
    import serial.tools.list_ports
    
    print("Searching for Arduino...")
    ports = serial.tools.list_ports.comports()
    
    for port in ports:
        print(f" Found port: {port.device} - {port.description}")
        # Look for common Arduino identifiers 
        if 'Arduino' in port.description or 'USB' in port.description or 'ACM' in port.device:
            print(f" Using: {port.device}")
            return port.description
    
    return None


def read_sensor_data(ser):
    """Read and parse JSON data from Arduino"""
    
    try:
        # Read one line from serial
        line = ser.readline().decode('utf-8').strip()
        
        # Skip non-JSON lines (startup messages, etc.)
        if not line.startswith('{'):
            return None
        
        # parse JSON data
        data = json.loads(line)
        return data
    
    except json.JSONDecodeError:
        print("Failed to decode JSON:", line)
        return None
    except UnicodeDecodeError:
        return None
    except Exception as e:
        print("Error reading from serial:", e)
        return None

def save_to_csv(data):
    """Save data to CSV file for logging"""
    timestamp = datatime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    with open('sensor_log.csv', 'a') as f:
        f.write(f"{timestamp},{data['raw']},{data['moisture']},{data['status']}\n")
        
def main():
    print("=" * 60)
    print(" Raspberry Pi - Arduino Soil Moisture Monitor")
    print("=" * 60)
    
    # Try to find Arduino automatically
    port = find_arduino_port()
    
    if not port:
        print(f"\n Arduino not found. Using default port: {SERIAL_PORT}")
        port = SERIAL_PORT
        
    
    print(f"\n Connecting to Arduino on {port}.....")
    
    try:
        # Open serial connection
        ser = serial.Serial(port, BAUD_RATE, timeout=2)
        time.sleep(2)  # Wait for connection to establish
        
        # clear any startup messages
        ser.flushInput()
        
        print("Connected")
        print("\n Reading soil moisture data....")
        print("-" * 60)
        
        while True:
            data = read_sensor_data(ser)
            
            if data:
                # Diaplay data
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                print(f"[{timestamp}] Raw: {data['raw']:4d} | " f"Moisture: {data['Moisture']:3d}% |"
                      f" Status: {data['status']}")
                
                # Save to CSv file
                save_to_csv(data)
            
            time.sleep(0.1)
    
    except serial.SerialException as e:
        print(f"\n Error: Could not connect to {port}")
        print(f"Details: {e}")
        print("\n Troubleshooting:")
        print("1. check Arduino is connected via USB")
        print("2. Run: ls /dev/tty* | grep - E 'ACM|USB'")
        print("3. Check permissions: sudo usermod -a -G dialout $USER")
        print(" (then logout and login again)")
    
    except KeyboardInterrupt:
        print("\n\n Exiting......")
        if 'ser' in locals() and ser.is_open:
            ser.close()
            print("Serial connection closed.")

if __name__ == "__main__":
    # Check if pyserial is installed
    try:
        import serial.tools.list_ports
        
    except ImportError:
        print("Installing pyserial.....")
        import os
        os.system("pip3 install pyserial")
        import serial.tools.list_ports
    
    main()