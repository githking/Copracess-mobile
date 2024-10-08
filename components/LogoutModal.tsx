import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";

interface LogoutModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isVisible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onPress={onCancel}
      >
        <View
          className="bg-white p-6 rounded-lg w-4/5 max-w-sm"
          style={{ elevation: 5 }}
        >
          <Text className="text-primary text-2xl font-pbold mb-4 text-center">
            SIGN OUT !
          </Text>
          <Text className="text-lg font-pmedium text-center mb-6">
            Are you sure you want{"\n"}to sign out?
          </Text>
          <View className="flex-row justify-between border-t border-gray-200">
            <TouchableOpacity className="flex-1 py-3" onPress={onCancel}>
              <Text className=" font-pregular text-center text-lg">Cancel</Text>
            </TouchableOpacity>
            <View className="border-r border-gray-200" />
            <TouchableOpacity className="flex-1 py-3" onPress={onConfirm}>
              <Text className="font-pregular text-center text-lg text-primary">
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default LogoutModal;
