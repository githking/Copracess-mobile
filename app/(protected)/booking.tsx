import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import BookingCalendar from "@/components/BookingCalendar";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import BookingHistorySidebar from "@/components/BookingSideBar";

const dummyBookingHistory = [
  {
    id: "1",
    destination: "Destination 1",
    date: "2024-10-15",
    weight: "5",
    plateNumber: "ABC123",
    status: "Completed",
  },
  {
    id: "2",
    destination: "Destination 2",
    date: "2024-10-20",
    weight: "3",
    plateNumber: "XYZ789",
    status: "Pending",
  },
  {
    id: "3",
    destination: "Destination 3",
    date: "2024-10-25",
    weight: "7",
    plateNumber: "DEF456",
    status: "In Progress",
  },
];

const booking = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [isHistorySidebarVisible, setIsHistorySidebarVisible] = useState(false);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleBook = () => {
    console.log("Booking:", { selectedDate, destination, weight, plateNumber });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date selected";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

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
          <Text className="text-lg font-psemibold mb-2">Destination:</Text>
          <View className="border border-primary bg-white rounded-md overflow-hidden">
            <Picker
              selectedValue={destination}
              onValueChange={(itemValue) => setDestination(itemValue)}
              className="h-12 w-full bg-white font-pregular"
            >
              <Picker.Item label="Select a destination" value="" />
              <Picker.Item label="Destination 1" value="destination1" />
              <Picker.Item label="Destination 2" value="destination2" />
              <Picker.Item label="Destination 3" value="destination3" />
            </Picker>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-psemibold mb-2">Weight (tons):</Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            className="border border-primary bg-white rounded-md p-2 h-12 font-pregular"
            placeholder="Enter weight"
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg font-psemibold mb-2">Plate Number:</Text>
          <TextInput
            value={plateNumber}
            onChangeText={setPlateNumber}
            className="border border-primary bg-white rounded-md p-2 h-12 font-pregular"
            placeholder="Enter plate number"
          />
        </View>

        <TouchableOpacity
          onPress={handleBook}
          className="bg-primary py-3 rounded-md mb-10"
        >
          <Text className="text-white text-center text-lg font-pbold">
            Book Delivery
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BookingHistorySidebar
        isVisible={isHistorySidebarVisible}
        onClose={() => setIsHistorySidebarVisible(false)}
        bookingHistory={dummyBookingHistory}
      />
    </View>
  );
};

export default booking;
