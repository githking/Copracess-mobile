// app/(protected)/booking.tsx

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

import BookingCalendar from "@/components/BookingCalendar";
import BookingHistorySidebar from "@/components/BookingSideBar";
import SelectOilMillModal from "@/components/SelectMillModal";

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


interface Booking {
  id: string;
  description: string;
  copraBuyerId: string;
  oilMillId: string;
  estimatedWeight: number;
  deliveryDate: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  driver: string;
  plateNumber: string;
  verificationToken?: string;
  createdAt: string;
  updatedAt: string;
}

const BookingScreen = () => {
  const params = useLocalSearchParams();
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [oilMills, setOilMills] = useState<Organization[]>([]);
  const [isLoadingOilMills, setIsLoadingOilMills] = useState(true);
  const [isHistorySidebarVisible, setIsHistorySidebarVisible] = useState(false);
  const [isOilMillModalVisible, setIsOilMillModalVisible] = useState(false);
  const [selectedOilMill, setSelectedOilMill] = useState<Organization | null>(
    null
  );
  useEffect(() => {
    if (params.organizationId && oilMills.length > 0) {
      const selectedOrg = oilMills.find(
        (mill) => mill.id === params.organizationId
      );
      if (selectedOrg) {
        setSelectedOilMill(selectedOrg);

        setForm((prev) => ({
          ...prev,
          oilMillId: selectedOrg.id,
        }));
      }
    }
  }, [params.organizationId, oilMills]);

  const [form, setForm] = useState({
    id: "",
    description: "",
    copraBuyerId: authState?.data.id || "",
    oilMillId: "",
    estimatedWeight: "",
    deliveryDate: "",
    status: "PENDING" as const,
    driver: "",
    plateNumber: "",
    verificationToken: "",
  });

  useEffect(() => {
    if (authState?.accessToken) {
      fetchBookings();
      fetchOilMills();
    }
  }, [authState?.accessToken]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/booking");
      setBookingHistory(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Alert.alert("Error", "Failed to fetch booking history");
    }
  };

  const fetchOilMills = async () => {
    try {
      const response = await axios.get("/map");
      console.log("selected oilmill", response.data.organizations[0].price)
      setOilMills(response.data.organizations);
    } catch (error) {
      console.error("Error fetching oil mills:", error);
      Alert.alert("Error", "Failed to fetch oil mills");
    } finally {
      setIsLoadingOilMills(false);
    }
  };

  const validateForm = () => {
    if (!form.oilMillId?.trim()) {
      Alert.alert("Error", "Please select an oil mill");
      return false;
    }
    if (!form.deliveryDate?.trim()) {
      Alert.alert("Error", "Please select a delivery date");
      return false;
    }
    if (!form.estimatedWeight?.trim()) {
      Alert.alert("Error", "Please enter the estimated weight");
      return false;
    }
    if (!form.plateNumber?.trim()) {
      Alert.alert("Error", "Please enter the plate number");
      return false;
    }
    if (!form.driver?.trim()) {
      Alert.alert("Error", "Please enter the driver name");
      return false;
    }
    if (!form.description?.trim()) {
      Alert.alert("Error", "Please enter a description");
      return false;
    }

    const weight = parseFloat(form.estimatedWeight);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert("Error", "Please enter a valid weight");
      return false;
    }

    const deliveryDate = new Date(form.deliveryDate);
    if (isNaN(deliveryDate.getTime())) {
      Alert.alert("Error", "Invalid delivery date format");
      return false;
    }

    return true;
  };

  const handleBook = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const bookingData = {
        id: "",
        description: form.description.trim(),
        copraBuyerId: form.copraBuyerId,
        oilMillId: form.oilMillId,
        estimatedWeight: parseFloat(form.estimatedWeight),
        deliveryDate: new Date(form.deliveryDate).toISOString(),
        status: "PENDING" as const,
        driver: form.driver.trim(),
        plateNumber: form.plateNumber.trim().toUpperCase(),
        verificationToken: "",
      };
      console.log("Booking data:", bookingData);
      const response = await axios.post("/booking", bookingData, {
        headers: {
          Authorization: `Bearer ${authState?.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Success", "Booking created successfully");
      await fetchBookings();
      resetForm();
    } catch (error: any) {
      console.error("Booking error:", error.response?.data || error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to create booking"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: "",
      description: "",
      copraBuyerId: authState?.data.id || "",
      oilMillId: "",
      estimatedWeight: "",
      deliveryDate: "",
      status: "PENDING",
      driver: "",
      plateNumber: "",
      verificationToken: "",
    });
    setSelectedDate("");
    setSelectedOilMill(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date selected";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setForm((prev) => ({ ...prev, deliveryDate: date }));
  };

  if (isLoadingOilMills) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#59A60E" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-off-100">
      <ScrollView className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl text-primary font-pbold">
            Book a Delivery
          </Text>
          <TouchableOpacity
            className="bg-white p-2 rounded-lg border border-primary"
            onPress={() => setIsHistorySidebarVisible(true)}
          >
            <FontAwesome name="history" size={24} color="#59A60E" />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-psemibold mb-2">Select Oil Mill:</Text>
          <TouchableOpacity
            onPress={() => setIsOilMillModalVisible(true)}
            className="border border-primary bg-white rounded-md p-3"
          >
            {selectedOilMill ? (
              <>
                <Text className="font-pmedium text-primary">
                  {selectedOilMill.name} 
                </Text>
                <Text className="text-sm text-gray-600">
                  {selectedOilMill.address}
                </Text>
                
                {selectedOilMill.price && selectedOilMill.price.length > 0 ? (
                    (() => {
                      // Sort prices by date to get the most recent one
                      const latestPrice = selectedOilMill.price.sort(
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
              </>
            ) : (
              <Text className="text-gray-500">Select an oil mill</Text>
            )}
          </TouchableOpacity>
        </View>

        <BookingCalendar onDateSelect={handleDateSelect} />

        <View className="mt-4 mb-4">
          <Text className="text-lg font-psemibold mb-2">Selected Date:</Text>
          <View className="border border-primary bg-white p-3 rounded-md">
            <Text className="text-black font-pregular">
              {formatDate(selectedDate)}
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-psemibold mb-2">Description:</Text>
          <TextInput
            value={form.description}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, description: text }))
            }
            className="border border-primary bg-white rounded-md p-3 font-pregular"
            placeholder="Enter delivery description"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg font-psemibold mb-2">Weight (tons):</Text>
          <TextInput
            value={form.estimatedWeight}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, estimatedWeight: text }))
            }
            keyboardType="decimal-pad"
            className="border border-primary bg-white rounded-md p-3 h-12 font-pregular"
            placeholder="Enter estimated weight"
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg font-psemibold mb-2">Plate Number:</Text>
          <TextInput
            value={form.plateNumber}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, plateNumber: text.toUpperCase() }))
            }
            autoCapitalize="characters"
            className="border border-primary bg-white rounded-md p-3 h-12 font-pregular"
            placeholder="Enter plate number"
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg font-psemibold mb-2">Driver Name:</Text>
          <TextInput
            value={form.driver}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, driver: text }))
            }
            className="border border-primary bg-white rounded-md p-3 h-12 font-pregular"
            placeholder="Enter driver name"
          />
        </View>

        <TouchableOpacity
          onPress={handleBook}
          disabled={isLoading}
          className={`bg-primary py-3 rounded-md mb-10 ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-pbold">
              Book Delivery
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <SelectOilMillModal
        visible={isOilMillModalVisible}
        onClose={() => setIsOilMillModalVisible(false)}
        onSelect={(mill) => {
          setSelectedOilMill(mill);
          setForm((prev) => ({ ...prev, oilMillId: mill.id }));
        }}
        organizations={oilMills}
        selectedOrganization={selectedOilMill}
        isLoading={isLoadingOilMills}
      />

      <BookingHistorySidebar
        isVisible={isHistorySidebarVisible}
        onClose={() => setIsHistorySidebarVisible(false)}
        bookingHistory={bookingHistory}
        oilMills={oilMills} // Add this prop
      />
    </View>
  );
};

export default BookingScreen;
