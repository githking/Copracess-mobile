import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ImageSourcePropType,
} from "react-native";

import type { SearchInputProps } from "../types/type";

const SearchInput: React.FC<SearchInputProps> = ({
  initialQuery = "",
  icon,
  handlePress,
}) => {
  const [query, setQuery] = useState(initialQuery);

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-white rounded-2xl border border-primary focus:border-secondary mt-0">
      <TextInput
        className="text-base mt-0.5 text-black flex-1 font-pregular"
        value={query}
        placeholder="Search Record"
        placeholderTextColor="#CDCDE0"
        onChangeText={setQuery}
      />
      <TouchableOpacity
        onPress={() => {
          if (query === "") {
            Alert.alert("Empty", "Please input something to search records");
          } else {
            handlePress();
          }
        }}
      >
        <Image
          source={icon}
          style={{ width: 20, height: 20, tintColor: "#59A60E" }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
