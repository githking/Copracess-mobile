// QRCodeModal.tsx
import React from "react";
import { View, Text, Modal, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { QRCodeModalProps } from "../types/type";

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isVisible,
  onClose,
  qrCodeData,
}) => {
  const handleDownload = () => {
    console.log("Downloading QR code...");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white p-6 rounded-2xl w-5/6 max-w-md">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-pbold text-primary">
              Access via QR code
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#59A60E" />
            </TouchableOpacity>
          </View>

          <View className="items-center mb-8 p-6 rounded-xl">
            <Image
              source={{
                uri:
                  "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" +
                  encodeURIComponent(qrCodeData),
              }}
              className="w-60 h-60"
            />
          </View>

          <Text className="text-center font-pbold mb-8 px-4">{qrCodeData}</Text>

          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity
              onPress={handleDownload}
              className="bg-primary py-3 px-6 rounded-full flex-row items-center"
            >
              <Ionicons
                name="download-outline"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-psemibold">Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="border border-primary bg-white py-3 px-6 rounded-full"
            >
              <Text className="text-primary font-psemibold">Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default QRCodeModal;
