// components/SearchInput.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import type { SearchInputProps } from "../types/type";

const SearchInput: React.FC<SearchInputProps> = ({
  initialQuery = "",
  icon,
  onSearch,
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = () => {
    if (query.trim() === "") {
      Alert.alert("Empty", "Please input something to search records");
      return;
    }
    onSearch(query);
  };

  return (
    <View className="flex flex-row items-center space-x-2 w-full h-12 px-3 bg-white rounded-lg border border-primary focus:border-secondary">
      <TextInput
        className="text-sm text-black flex-1 font-pregular"
        value={query}
        placeholder="Search Record"
        placeholderTextColor="#CDCDE0"
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={handleSearch}>
        <Image
          source={icon}
          className="w-5 h-5"
          style={{ tintColor: "#59A60E" }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
