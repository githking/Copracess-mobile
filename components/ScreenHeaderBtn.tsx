import { Image, TouchableOpacity, ImageSourcePropType } from "react-native";

import { ScreenHeaderBtnProps } from "../types/type";

const ScreenHeaderBtn = ({
  iconUrl,
  handlePress,
  width,
  height,
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
