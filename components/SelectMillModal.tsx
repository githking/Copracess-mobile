import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { icons } from "@/constants";

interface Price {
  date: string;
  price: number;
  market_price: number;
}

interface Organization {
  id: string;
  name: string;
  address: string;
  price: Price[];
}
type SortOrder = "priceAsc" | "priceDesc" | "none";

interface SelectOilMillModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (organization: Organization) => void;
  organizations: Organization[];
  selectedOrganization: Organization | null;
  isLoading?: boolean;
}

const SelectOilMillModal: React.FC<SelectOilMillModalProps> = ({
  visible,
  onClose,
  onSelect,
  organizations,
  selectedOrganization,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrganizations, setFilteredOrganizations] =
    useState<Organization[]>(organizations);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const searchTimeout = useRef<NodeJS.Timeout>();

  console.log("S ORg", organizations);

  useEffect(() => {
    let sorted = [...organizations];

    // Apply search filter
    if (searchQuery) {
      sorted = sorted.filter(
        (org) =>
          org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          org.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price sorting
    if (sortOrder !== "none") {
      sorted = sorted.sort((a, b) => {
        const priceA = a.price?.[0]?.price || 0;
        const priceB = b.price?.[0]?.price || 0;
        return sortOrder === "priceAsc" ? priceA - priceB : priceB - priceA;
      });
    }

    setFilteredOrganizations(sorted);
  }, [organizations, searchQuery, sortOrder]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      const filtered = organizations.filter(
        (org) =>
          org.name.toLowerCase().includes(text.toLowerCase()) ||
          org.address.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    }, 300);
  };

  const handleSelect = (organization: Organization) => {
    onSelect(organization);
    onClose();
  };
  const renderSortButtons = () => (
    <View className="flex-row justify-end space-x-2 mb-2">
      <TouchableOpacity
        onPress={() => setSortOrder("priceAsc")}
        className={`px-3 py-1 rounded-full ${
          sortOrder === "priceAsc" ? "bg-primary" : "bg-gray-100"
        }`}
      >
        <Text className={`text-xs font-pmedium text-white`}>
          Price: Low to High
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSortOrder("priceDesc")}
        className={`px-3 py-1 rounded-full ${
          sortOrder === "priceDesc" ? "bg-primary" : "bg-gray-100"
        }`}
      >
        <Text className={`text-xs font-pmedium text-white`}>
          Price: High to Low
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrganizationCard = ({ item }: { item: Organization }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className={`p-4 mb-3 rounded-lg border-2 ${
        selectedOrganization?.id === item.id
          ? "border-primary bg-primary/10"
          : "border-gray-200 bg-white"
      }`}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="font-pbold text-lg text-primary">{item.name}</Text>
          <Text className="text-gray-600 mt-1">{item.address}</Text>
        </View>
        {selectedOrganization?.id === item.id && (
          <View className="bg-primary rounded-full p-2">
            <FontAwesome name="check" size={16} color="white" />
          </View>
        )}
      </View>
      {item.price && item.price.length > 0 ? (
        (() => {
          // Sort prices by date to get the most recent one
          const latestPrice = item.price.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];
          return (
            <View>
              <Text className="text-sm text-gray-700">
                Latest Price: {latestPrice.price} PHP
              </Text>
              <Text className="text-sm text-gray-700">
                Market Price: {latestPrice.market_price} PHP
              </Text>
              <Text className="text-xs text-gray-500">
                Date: {new Date(latestPrice.date).toLocaleDateString()}
              </Text>
            </View>
          );
        })()
      ) : (
        <Text className="text-sm text-gray-500">No price available</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback>
            <View className="bg-white w-11/12 max-h-[80%] rounded-xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-pbold">Select Oil Mill</Text>
                <TouchableOpacity onPress={onClose}>
                  <FontAwesome name="times" size={24} color="#59A60E" />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Search oil mills..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="border border-gray-300 rounded-lg px-4 py-2 mb-2"
              />

              {renderSortButtons()}

              {isLoading ? (
                <ActivityIndicator size="large" color="#59A60E" />
              ) : (
                <FlatList
                  data={filteredOrganizations}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <MillListItem
                      item={item}
                      selectedOrganization={selectedOrganization}
                      onSelect={onSelect}
                    />
                  )}
                  ListEmptyComponent={
                    <View className="flex-1 justify-center items-center py-8">
                      <Text className="text-gray-500 font-pmedium">
                        No oil mills found
                      </Text>
                    </View>
                  }
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const MillListItem = ({
  item,
  selectedOrganization,
  onSelect,
}: {
  item: Organization;
  selectedOrganization: Organization | null;
  onSelect: (org: Organization) => void;
}) => {
  const latestPrice = item.price?.[0]?.price || 0;

  return (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      className={`p-4 border-b border-gray-200 ${
        selectedOrganization?.id === item.id ? "bg-primary/10" : ""
      }`}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-pbold text-lg text-primary">{item.name}</Text>
          <Text className="text-gray-600 mt-1">{item.address}</Text>
          <Text className="text-primary font-pmedium mt-1">
            Price: ₱{latestPrice.toFixed(2)}
          </Text>
        </View>
        {selectedOrganization?.id === item.id && (
          <View className="bg-primary rounded-full p-2">
            <FontAwesome name="check" size={16} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
export default SelectOilMillModal;
