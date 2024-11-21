import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import IconButton from "./iconButton";
import { SymbolView } from "expo-symbols";

interface BottomRowToolsProps {
  handleTakePicture: () => void;
}
export default function BottomRowTools({
  handleTakePicture,
}: BottomRowToolsProps) {
  return (
    <View style={[styles.bottomContainer, styles.directionRowItemsCenter]}>
      <View>
        <TouchableOpacity onPress={handleTakePicture}>
          <SymbolView
            name={"circle"}
            size={90}
            type="hierarchical"
            tintColor={"white"}
            animationSpec={{
              effect: {
                type: "bounce",
              },
              repeating: false,
            }}
            fallback={
              <TouchableOpacity
                onPress={handleTakePicture}
                style={{
                  width: 90,
                  height: 90,
                  borderWidth: 1,
                  borderColor: "white",
                  borderRadius: 45,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></TouchableOpacity>
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  directionRowItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bottomContainer: {
    width: "100%",
    justifyContent: "center",
    position: "absolute",
    alignSelf: "center",
    bottom: 6,
  },
});
