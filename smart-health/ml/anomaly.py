"""
Train TensorFlow Lite models for health monitoring
Requires: tensorflow, numpy, scikit-learn
Install: pip install tensorflow numpy scikit-learn
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import json

class HealthModelTrainer:
    """Train ML models for health monitoring"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = None
        
    def generate_synthetic_training_data(self, n_samples=10000):
        """
        Generate synthetic training data for demonstration
        In production, replace with real collected data
        """
        np.random.seed(42)
        
        # Normal patterns (80% of data)
        n_normal = int(n_samples * 0.8)
        
        # Normal heart rate: 60-100 BPM
        hr_normal = np.random.normal(75, 10, n_normal)
        # Normal SpO2: 95-100%
        spo2_normal = np.random.normal(98, 1.5, n_normal)
        # Normal HRV: 30-80 ms
        hrv_normal = np.random.normal(55, 15, n_normal)
        # Normal stress: 10-40
        stress_normal = np.random.normal(25, 10, n_normal)
        
        # Clip to realistic ranges
        hr_normal = np.clip(hr_normal, 60, 100)
        spo2_normal = np.clip(spo2_normal, 95, 100)
        hrv_normal = np.clip(hrv_normal, 20, 100)
        stress_normal = np.clip(stress_normal, 0, 50)
        
        normal_data = np.column_stack([
            hr_normal, spo2_normal, hrv_normal, stress_normal
        ])
        normal_labels = np.zeros(n_normal)
        
        # Anomalous patterns (20% of data)
        n_anomaly = n_samples - n_normal
        
        anomaly_types = []
        
        # Type 1: Tachycardia (high HR)
        n1 = n_anomaly // 4
        hr_tachy = np.random.normal(120, 15, n1)
        spo2_tachy = np.random.normal(96, 2, n1)
        hrv_tachy = np.random.normal(30, 10, n1)
        stress_tachy = np.random.normal(70, 15, n1)
        anomaly_types.append(np.column_stack([
            hr_tachy, spo2_tachy, hrv_tachy, stress_tachy
        ]))
        
        # Type 2: Bradycardia (low HR)
        n2 = n_anomaly // 4
        hr_brady = np.random.normal(45, 5, n2)
        spo2_brady = np.random.normal(97, 1, n2)
        hrv_brady = np.random.normal(70, 10, n2)
        stress_brady = np.random.normal(15, 5, n2)
        anomaly_types.append(np.column_stack([
            hr_brady, spo2_brady, hrv_brady, stress_brady
        ]))
        
        # Type 3: Low SpO2
        n3 = n_anomaly // 4
        hr_hypox = np.random.normal(85, 10, n3)
        spo2_hypox = np.random.normal(90, 3, n3)
        hrv_hypox = np.random.normal(40, 15, n3)
        stress_hypox = np.random.normal(60, 15, n3)
        anomaly_types.append(np.column_stack([
            hr_hypox, spo2_hypox, hrv_hypox, stress_hypox
        ]))
        
        # Type 4: High stress with low HRV
        n4 = n_anomaly - n1 - n2 - n3
        hr_stress = np.random.normal(95, 10, n4)
        spo2_stress = np.random.normal(97, 1, n4)
        hrv_stress = np.random.normal(20, 5, n4)
        stress_stress = np.random.normal(85, 10, n4)
        anomaly_types.append(np.column_stack([
            hr_stress, spo2_stress, hrv_stress, stress_stress
        ]))
        
        anomaly_data = np.vstack(anomaly_types)
        anomaly_labels = np.ones(n_anomaly)
        
        # Combine and shuffle
        X = np.vstack([normal_data, anomaly_data])
        y = np.concatenate([normal_labels, anomaly_labels])
        
        # Shuffle
        indices = np.random.permutation(len(X))
        X = X[indices]
        y = y[indices]
        
        return X, y
    
    def build_anomaly_detection_model(self, input_dim=4):
        """Build autoencoder for anomaly detection"""
        # Encoder
        encoder_input = keras.Input(shape=(input_dim,))
        x = keras.layers.Dense(16, activation='relu')(encoder_input)
        x = keras.layers.Dropout(0.2)(x)
        x = keras.layers.Dense(8, activation='relu')(x)
        encoded = keras.layers.Dense(4, activation='relu')(x)
        
        # Decoder
        x = keras.layers.Dense(8, activation='relu')(encoded)
        x = keras.layers.Dropout(0.2)(x)
        x = keras.layers.Dense(16, activation='relu')(x)
        decoded = keras.layers.Dense(input_dim, activation='linear')(x)
        
        # Autoencoder
        autoencoder = keras.Model(encoder_input, decoded)
        autoencoder.compile(optimizer='adam', loss='mse', metrics=['mae'])
        
        return autoencoder
    
    def build_classification_model(self, input_dim=4):
        """Build binary classification model for anomaly detection"""
        model = keras.Sequential([
            keras.layers.Dense(32, activation='relu', input_shape=(input_dim,)),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(16, activation='relu'),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(8, activation='relu'),
            keras.layers.Dense(1, activation='sigmoid')
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy', 'AUC']
        )
        
        return model
    
    def train_model(self, model_type='classification'):
        """Train the model"""
        print("Generating training data...")
        X, y = self.generate_synthetic_training_data(n_samples=10000)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        print(f"Training {model_type} model...")
        
        if model_type == 'autoencoder':
            # For autoencoder, train on normal data only
            X_normal = X_train_scaled[y_train == 0]
            self.model = self.build_anomaly_detection_model()
            
            history = self.model.fit(
                X_normal, X_normal,
                epochs=50,
                batch_size=32,
                validation_split=0.2,
                verbose=1
            )
            
        else:  # classification
            self.model = self.build_classification_model()
            
            history = self.model.fit(
                X_train_scaled, y_train,
                epochs=50,
                batch_size=32,
                validation_data=(X_test_scaled, y_test),
                verbose=1
            )
        
        # Evaluate
        print("\nEvaluating model...")
        if model_type == 'classification':
            loss, accuracy, auc = self.model.evaluate(X_test_scaled, y_test)
            print(f"Test Accuracy: {accuracy:.4f}")
            print(f"Test AUC: {auc:.4f}")
        else:
            # For autoencoder, calculate reconstruction error
            reconstructions = self.model.predict(X_test_scaled)
            mse = np.mean(np.square(X_test_scaled - reconstructions), axis=1)
            
            # Normal vs anomaly MSE
            normal_mse = mse[y_test == 0]
            anomaly_mse = mse[y_test == 1]
            
            print(f"Normal MSE (mean): {np.mean(normal_mse):.4f}")
            print(f"Anomaly MSE (mean): {np.mean(anomaly_mse):.4f}")
        
        return history
    
    def convert_to_tflite(self, model_path='health_anomaly_model.tflite'):
        """Convert model to TensorFlow Lite format"""
        print(f"\nConverting model to TFLite...")
        
        # Convert to TFLite
        converter = tf.lite.TFLiteConverter.from_keras_model(self.model)
        
        # Optimize for size and latency
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        
        # Convert
        tflite_model = converter.convert()
        
        # Save
        with open(model_path, 'wb') as f:
            f.write(tflite_model)
        
        print(f"TFLite model saved to {model_path}")
        print(f"Model size: {len(tflite_model) / 1024:.2f} KB")
        
        # Save scaler parameters
        scaler_params = {
            'mean': self.scaler.mean_.tolist(),
            'scale': self.scaler.scale_.tolist()
        }
        
        with open('scaler_params.json', 'w') as f:
            json.dump(scaler_params, f)
        
        print("Scaler parameters saved to scaler_params.json")
    
    def test_tflite_model(self, model_path='health_anomaly_model.tflite'):
        """Test the TFLite model"""
        print("\nTesting TFLite model...")
        
        # Load TFLite model
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        
        # Test with sample data
        test_samples = np.array([
            [75, 98, 55, 25],  # Normal
            [130, 92, 20, 80],  # Anomaly
            [70, 99, 60, 20],  # Normal
            [45, 96, 30, 15],  # Anomaly
        ], dtype=np.float32)
        
        # Scale
        test_samples_scaled = self.scaler.transform(test_samples)
        
        print("\nTest predictions:")
        for i, sample in enumerate(test_samples_scaled):
            interpreter.set_tensor(
                input_details[0]['index'],
                sample.reshape(1, -1).astype(np.float32)
            )
            interpreter.invoke()
            output = interpreter.get_tensor(output_details[0]['index'])
            
            print(f"Sample {i+1}: {test_samples[i]} -> Prediction: {output[0][0]:.4f}")

class TFLiteHealthPredictor:
    """Use TFLite model for predictions on Raspberry Pi"""
    
    def __init__(self, model_path='health_anomaly_model.tflite', 
                 scaler_path='scaler_params.json'):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
        except ImportError:
            self.interpreter = tf.lite.Interpreter(model_path=model_path)
        
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        
        # Load scaler parameters
        with open(scaler_path, 'r') as f:
            scaler_params = json.load(f)
        
        self.mean = np.array(scaler_params['mean'])
        self.scale = np.array(scaler_params['scale'])
    
    def predict(self, hr, spo2, hrv, stress):
        """Predict anomaly score"""
        # Create input array
        features = np.array([[hr, spo2, hrv, stress]], dtype=np.float32)
        
        # Scale
        features_scaled = (features - self.mean) / self.scale
        
        # Predict
        self.interpreter.set_tensor(
            self.input_details[0]['index'],
            features_scaled.astype(np.float32)
        )
        self.interpreter.invoke()
        output = self.interpreter.get_tensor(self.output_details[0]['index'])
        
        return float(output[0][0])

# Training script
if __name__ == "__main__":
    trainer = HealthModelTrainer()
    
    # Train classification model
    print("="*60)
    print("Training Anomaly Detection Model")
    print("="*60)
    
    history = trainer.train_model(model_type='classification')
    
    # Convert to TFLite
    trainer.convert_to_tflite('health_anomaly_model.tflite')
    
    # Test TFLite model
    trainer.test_tflite_model('health_anomaly_model.tflite')
    
    print("\n" + "="*60)
    print("Training Complete!")
    print("="*60)
    print("\nFiles generated:")
    print("1. health_anomaly_model.tflite - TFLite model for Raspberry Pi")
    print("2. scaler_params.json - Feature scaling parameters")
    print("\nCopy these files to your Raspberry Pi project directory.")
