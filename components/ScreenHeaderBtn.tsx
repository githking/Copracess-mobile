import { Image, TouchableOpacity, ImageSourcePropType } from "react-native";

interface ScreenHeaderBtnProps {
  iconUrl: ImageSourcePropType;
  handlePress: () => void;
  width?: number;
  height?: number;
}

const ScreenHeaderBtn = ({
  iconUrl,
  handlePress,
  width = 24,
  height = 24,
}: ScreenHeaderBtnProps) => {
  return (
    <TouchableOpacity
      className="rounded justify-center items-center"
      onPress={handlePress}
    >
      <Image source={iconUrl} resizeMode="contain" style={{ width, height }} />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;
