import React, { useEffect } from "react";
import { View, Image } from "react-native";
import { images } from "../constants";

import type { SplashScreenProps } from "../types/type";

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={images.LogoSplash}
        className="w-64 h-64"
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
