import { Image, StyleSheet, Platform, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Camera, CameraMode, CameraView, FlashMode } from "expo-camera";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import IconButton from "@/components/iconButton";
import BottomRowTools from "@/components/BottomRowTools";
import CameraTools from "@/components/CameraTools";
import PictureView from "@/components/PictureView";

export default function HomeScreen() {
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">(
    "back"
  );
  const [picture, setPicture] = React.useState<string>("");

  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({});
    setPicture(response!.uri);
  }

  if (picture) return <PictureView picture={picture} setPicture={setPicture} />;
  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        mode="picture"
        style={{ flex: 1 }}
        facing={cameraFacing}
        enableTorch={cameraTorch}
      >
        <CameraTools
          cameraTorch={cameraTorch}
          setCameraFacing={setCameraFacing}
          setCameraTorch={setCameraTorch}
        />
        <BottomRowTools handleTakePicture={handleTakePicture} />
      </CameraView>
    </View>
  );
}
