import { View, Text, SafeAreaView } from "react-native";
import { Stack, useRouter } from "expo-router";
import React from "react";

import ScreenHeaderBtn from "../../components/ScreenHeaderBtn";
import { images } from "../../constants";

const home = () => {
  return (
    <View>
      <Text>Copra Owner Home</Text>
    </View>
  );
};

export default home;
