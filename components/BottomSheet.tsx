import React, { useMemo } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Geolocation {
  id: string;
  latitude: number;
  longitude: number;
}

interface Price {
  id: string;
  price: number;
  market_price: number;
  date: string;
  organizationId: string;
}

interface Organization {
  id: string;
  name: string;
  address: string;
  accessCode: string;
  createdAt: string;
  updatedAt: string;
  permit: string | null;
  isVerified: boolean;
  geolocationId: string | null;
  creatorId: string;
  geolocation: Geolocation;
  price: Price[];
  distance?: number;
}

interface OrganizationBottomSheetProps {
  organizations: Organization[];
  onOrganizationSelect: (organization: Organization) => void;
  onClose: () => void;
  visible?: boolean;
}

const OrganizationBottomSheet: React.FC<OrganizationBottomSheetProps> = ({
  organizations,
  onOrganizationSelect,
  onClose,
  visible = true,
}) => {
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const router = useRouter();

  const handleBooking = (organization: Organization) => {
    onClose();
    router.push({
      pathname: "/booking",
      params: {
        organizationId: organization.id,
      },
    });
  };
  const getLatestPrice = (prices: Price[]) => {
    if (!prices || prices.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPrice = prices.find((price) => {
      const priceDate = new Date(price.date);
      priceDate.setHours(0, 0, 0, 0);
      return priceDate.getTime() === today.getTime();
    });

    return todayPrice || null;
  };
  const renderOrganizationCard = ({ item }: { item: Organization }) => {
    const latestPrice = getLatestPrice(item.price);

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    return (
      <View className="bg-white p-4 mb-3 rounded-lg shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-pbold text-primary">{item.name}</Text>
          <Text className="text-base font-pmedium text-secondary">
            ₱{latestPrice ? latestPrice.price.toFixed(2) : "0.00"}/kg
          </Text>
        </View>

        <Text className="text-gray-600 text-sm mb-2 font-pregular">
          {item.address}
        </Text>

        {item.distance !== undefined && (
          <Text className="text-primary text-sm font-pmedium mb-2">
            {item.distance.toFixed(1)} km away
          </Text>
        )}

        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <View
              className={`h-2 w-2 rounded-full mr-2 ${
                item.isVerified ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <Text className="text-sm font-pmedium text-gray-600">
              {item.isVerified ? "Verified" : "Unverified"}
            </Text>
          </View>
          <Text className="text-xs text-gray-400">
            Since {formatDate(item.createdAt)}
          </Text>
        </View>

        {latestPrice && latestPrice.market_price > 0 && (
          <View className="mt-2 bg-gray-50 p-2 rounded">
            <Text className="text-xs text-gray-500">
              Market Price: ₱{latestPrice.market_price.toFixed(2)}/kg
            </Text>
          </View>
        )}

        <View className="flex-row justify-between mt-4 space-x-2">
          <TouchableOpacity
            onPress={() => onOrganizationSelect(item)}
            className="flex-1 bg-primary/10 py-2 rounded-md flex-row items-center justify-center"
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#59A60E"
            />
            <Text className="text-primary font-pmedium ml-2">View on Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBooking(item)}
            className="flex-1 bg-primary py-2 rounded-md flex-row items-center justify-center"
          >
            <MaterialCommunityIcons
              name="calendar-check"
              size={20}
              color="#FFFFFF"
            />
            <Text className="text-white font-pmedium ml-2">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      index={1}
    >
      <View className="flex-1 px-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-pbold">Oil Mills</Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 rounded-full bg-gray-100"
          >
            <MaterialCommunityIcons name="close" size={20} color="#000000" />
          </TouchableOpacity>
        </View>

        <BottomSheetFlatList
          data={organizations}
          keyExtractor={(item) => item.id}
          renderItem={renderOrganizationCard}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </BottomSheet>
  );
};

export default OrganizationBottomSheet;
