import { View } from "react-native";
import IconButton from "./iconButton";

interface CameraToolsProps {
  cameraTorch: boolean;
  setCameraFacing: React.Dispatch<React.SetStateAction<"front" | "back">>;
  setCameraTorch: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function CameraTools({
  cameraTorch,
  setCameraFacing,
  setCameraTorch,
}: CameraToolsProps) {
  return (
    <View
      style={{
        position: "absolute",
        right: 6,
        top: 80,
        zIndex: 1,
        gap: 16,
      }}
    >
      <IconButton
        onPress={() => setCameraTorch((prevValue) => !prevValue)}
        iosName={
          cameraTorch ? "flashlight.off.circle" : "flashlight.slash.circle"
        }
        androidName={cameraTorch ? "flash" : "flash-off"}
      />
      <IconButton
        onPress={() =>
          setCameraFacing((prevValue) =>
            prevValue === "back" ? "front" : "back"
          )
        }
        iosName={"arrow.triangle.2.circlepath.camera"}
        androidName="camera-reverse"
        width={25}
        height={21}
      />
    </View>
  );
}
