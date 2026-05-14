import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

// TODO 1: Import ImagePicker from 'expo-image-picker'
// Docs: https://docs.expo.dev/versions/latest/sdk/imagepicker/


// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function PhotoScreen() {
  const [photo, setPhoto] = useState(null);

  // TODO 2: Set up the camera permission hook using ImagePicker.useCameraPermissions()


  const takePhoto = async () => {
    // TODO 3: Request permission if not already granted.
    // Check permission?.granted — if false, call requestPermission().
    // If still not granted, return early.


    // TODO 4: Open the system camera.
    // const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    // If the user did not cancel, call setPhoto(result.assets[0]);

  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📷 Camera</Text>

      {/* Show photo if taken, otherwise show the button */}
      {photo ? (
        <View>
          {/* TODO 5: Display the photo using <Image source={{ uri: photo.uri }} style={styles.image} /> */}


          <TouchableOpacity style={styles.retakeButton} onPress={() => setPhoto(null)}>
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    marginBottom: 16,
  },
  retakeButton: {
    backgroundColor: '#1c1c2e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  retakeText: {
    color: '#FF6B35',
    fontWeight: '700',
    fontSize: 15,
  },
});
