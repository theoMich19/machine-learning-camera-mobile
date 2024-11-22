import React, { useState } from "react";
import { Image } from "expo-image";
import { Alert, View, ActivityIndicator } from "react-native";
import { shareAsync } from "expo-sharing";
import { saveToLibraryAsync } from "expo-media-library";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import IconButton from "./iconButton";

interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
}

export default function PictureView({ picture, setPicture }: PictureViewProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function sendPicture() {
    const url = "http://192.168.1.40:3000/process-image"; // Remplacez par votre URL

    try {
      setIsLoading(true);

      // Créer un FormData
      const formData = new FormData();

      // Convertir l'image base64 en fichier
      const filename = "photo.jpg";
      formData.append("image", {
        uri: picture,
        name: filename,
        type: "image/jpeg",
      } as any);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log("Données reçues :", responseData.message);

      Alert.alert("Quel personnaaaage ?? 🥁🥁", responseData.message, [
        {
          text: "TOP",
          onPress: () => {
            setPicture("");
          },
        },
      ]);
    } catch (error) {
      console.error("Erreur :", error);
      Alert.alert("Erreur lors de l'envoi de l'image");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
    >
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 2,
          }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <View
        style={{
          position: "absolute",
          right: 6,
          zIndex: 1,
          paddingTop: 50,
          gap: 16,
        }}
      >
        <IconButton
          onPress={sendPicture}
          iosName={"arrow.down"}
          androidName="send"
        />
      </View>

      <View
        style={{
          position: "absolute",
          zIndex: 1,
          paddingTop: 50,
          left: 6,
        }}
      >
        <IconButton
          onPress={() => setPicture("")}
          iosName={"xmark"}
          androidName="close"
        />
      </View>
      <Image
        source={picture}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 5,
        }}
      />
    </Animated.View>
  );
}
