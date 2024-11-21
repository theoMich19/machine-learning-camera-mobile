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
