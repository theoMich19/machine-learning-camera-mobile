<<<<<<< HEAD
import { Image, StyleSheet, Platform, Button, Alert } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SymbolView } from 'expo-symbols';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { usePermissions } from 'expo-media-library';
import { useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function OnboardingScreen() {
    const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
    const [mediaLibraryPermission, requestMediaLibraryPermission] = usePermissions();

    async function handleContinue() {
        const allPermissions = await requestAllPermissions();
        if(allPermissions){
            router.replace("/(tabs)")
        } else {
            Alert.alert("Error", "Permissions are required to continue");
        }
    }

    async function requestAllPermissions() {
        const cameraStatus = await requestCameraPermissions();
        if(!cameraStatus.granted){
            Alert.alert("Error", "Camera permissions are required to continue");
            return false;
        }

        const mediaLibraryStatus = await requestMediaLibraryPermission();
        if(!mediaLibraryStatus.granted){
            Alert.alert("Error", "Media library permissions are required to continue");
            return false;
        }

        await AsyncStorage.setItem("hasOpened", "true");
        return true;
    }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <SymbolView 
            name="camera.circle"
            size={250}
            type='hierarchical'
            tintColor={Colors.dark.snapPrimary}
            animationSpec={{
                effect: {
                    type: "bounce"
                }
            }}
            fallback={
                <Image
                  source={require('@/assets/images/partial-react-logo.png')}
                  style={styles.reactLogo}
                />
            }
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Snapchat Camera!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          Welcome to friend! To provide the best experience, this app requires
          permissions for the following:
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Camera Permissions</ThemedText>
        <ThemedText>🎥 For taking pictures and videos</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Microphone Permissions</ThemedText>
        <ThemedText>🎙️ For taking videos with audio</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Media Library Permissions</ThemedText>
        <ThemedText>📸 To save/view your amazing shots </ThemedText>
      </ThemedView>
      <Button title="Continue" onPress={handleContinue} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
=======
import React, { useEffect } from "react";
import { View, Alert } from "react-native";
import { useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function OnboardingScreen() {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();

  useEffect(() => {
    requestPermissions();
  }, []);

  async function requestPermissions() {
    const cameraStatus = await requestCameraPermissions();

    if (cameraStatus.granted) {
      await AsyncStorage.setItem("hasOpened", "true");
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        "Permissions Required",
        "Camera permissions are needed to continue",
        [
          {
            text: "Open Settings",
            onPress: () => requestCameraPermissions(),
          },
        ]
      );
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
  );
}
>>>>>>> bcc65cb06b6560558029fa20049deb919247969a
