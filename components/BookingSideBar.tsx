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
import QRCodeModal from "../components/QrCodeModal";

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
  qrCodeUrl?: string;
  price?: number;
}
interface Organization {
  id: string;
  name: string;
  address: string;
}

interface BookingHistorySidebarProps {
  isVisible: boolean;
  onClose: () => void;
  bookingHistory: Booking[];
  oilMills: Organization[]; // Add this prop
}
const getMillName = (millId: string, oilMills: Organization[]) => {
  const mill = oilMills.find((mill) => mill.id === millId);
  return mill?.name || "Unknown Mill";
};
const formatDate = (dateString: string) => {
  if (!dateString) return "No date selected";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const BookingHistoryCard = ({
  booking,
  onViewQRCode,
  oilMills, // Add this prop
}: {
  booking: Booking;
  onViewQRCode: (data: string) => void;
  oilMills: Organization[];
}) => (
  <View className="bg-white p-4 rounded-md mb-4 shadow-sm">
    <View className="flex-row justify-between items-center mb-2">
      <Text className="font-psemibold text-lg text-primary">
        {getMillName(booking.oilMillId, oilMills)}
      </Text>
      <Text
        className={`text-sm font-pmedium px-2 py-1 rounded ${
          booking.status === "PENDING"
            ? "bg-yellow-100 text-yellow-800"
            : booking.status === "COMPLETED"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {booking.status}
      </Text>
    </View>
    <Text className="font-pregular mb-1">
      Delivery: {formatDate(booking.deliveryDate)}
    </Text>
    <Text className="font-pregular mb-1">
      Weight: {booking.estimatedWeight} tons
    </Text>
    <Text className="font-pregular mb-1">
      Plate Number: {booking.plateNumber}
    </Text>
    <Text className="font-pregular mb-1">Driver: {booking.driver}</Text>
    {booking.price && (
      <Text className="font-pregular mb-1">Price: ₱{booking.price}/kg</Text>
    )}
    <Text className="font-pregular mb-2 text-gray-500">
      {booking.description}
    </Text>

    {booking.qrCodeUrl && (
      <TouchableOpacity
        className="bg-primary py-2 rounded-md"
        onPress={() => onViewQRCode(booking.qrCodeUrl || "")}
      >
        <Text className="text-white text-center font-psemibold">
          View QR Code
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

const BookingHistorySidebar: React.FC<BookingHistorySidebarProps> = ({
  isVisible,
  onClose,
  bookingHistory,
  oilMills,
}) => {
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const sidebarWidth = screenWidth * 0.75; // 75% of screen width

  const handleViewQRCode = (data: string) => {
    console.log(data);
    setQrCodeData(data);
    setQrModalVisible(true);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
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
                  oilMills={oilMills}
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
