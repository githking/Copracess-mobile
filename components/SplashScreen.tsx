import React, { useEffect } from "react";
import { View, Image } from "react-native";
import { images } from "../constants";
import type { SplashScreenProps } from "../types/type";

interface EnhancedSplashScreenProps extends SplashScreenProps {
  isFontsLoaded: boolean;
  isAppReady: boolean;
}

const SplashScreenComponent: React.FC<EnhancedSplashScreenProps> = ({
  onFinish,
  isFontsLoaded,
  isAppReady,
}) => {
  useEffect(() => {
    if (isFontsLoaded || isAppReady) {
      const timer = setTimeout(() => {
        onFinish();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isFontsLoaded, isAppReady, onFinish]);

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

export default SplashScreenComponent;
