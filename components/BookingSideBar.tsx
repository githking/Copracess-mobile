// BookingHistorySidebar.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Booking, BookingHistorySidebarProps } from "../types/type";
import QRCodeModal from "../components/QrCodeModal";

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

const BookingHistoryCard = ({
  booking,
  onViewQRCode,
}: {
  booking: Booking;
  onViewQRCode: (data: string) => void;
}) => (
  <View className="bg-white p-4 rounded-md mb-4 shadow-sm">
    <Text className="font-psemibold text-lg mb-2">{booking.destination}</Text>
    <Text className="font-pregular mb-1">Date: {formatDate(booking.date)}</Text>
    <Text className="font-pregular mb-1">Weight: {booking.weight} tons</Text>
    <Text className="font-pregular mb-1">
      Plate Number: {booking.plateNumber}
    </Text>
    <Text className="font-pregular mb-2">Status: {booking.status}</Text>
    <TouchableOpacity
      className="bg-primary py-2 rounded-md"
      onPress={() => onViewQRCode(`Booking: ${booking.id}`)}
    >
      <Text className="text-white text-center font-psemibold">
        View QR Code
      </Text>
    </TouchableOpacity>
  </View>
);

const BookingHistorySidebar: React.FC<BookingHistorySidebarProps> = ({
  isVisible,
  onClose,
  bookingHistory,
}) => {
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const sidebarWidth = screenWidth * 0.75; // 75% of screen width

  const handleViewQRCode = (data: string) => {
    setQrCodeData(data);
    setQrModalVisible(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 flex-row">
        <TouchableOpacity
          style={{ width: screenWidth - sidebarWidth }}
          className="bg-black opacity-50"
          onPress={onClose}
        />
        <View style={{ width: sidebarWidth }} className="bg-white">
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-pbold text-primary">
                Booking History
              </Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Ionicons name="close" size={24} color="#59A60E" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={bookingHistory}
              renderItem={({ item }) => (
                <BookingHistoryCard
                  booking={item}
                  onViewQRCode={handleViewQRCode}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </View>
      <QRCodeModal
        isVisible={qrModalVisible}
        onClose={() => setQrModalVisible(false)}
        qrCodeData={qrCodeData}
      />
    </Modal>
  );
};

export default BookingHistorySidebar;
