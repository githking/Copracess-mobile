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
    <View className="flex flex-row items-center space-x-2 w-full h-12 px-3 bg-white rounded-lg border border-primary focus:border-secondary">
      <TextInput
        className="text-sm text-black flex-1 font-pregular"
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
          style={{ width: 16, height: 16, tintColor: "#59A60E" }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
