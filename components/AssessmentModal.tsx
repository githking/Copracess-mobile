import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { VirtualQueueItem } from "@/types/type";

interface AssessmentModalProps {
  visible: boolean;
  item: VirtualQueueItem;
  onClose: () => void;
  onSave: (details: {
    actualWeight: string;
    moistureContent: string;
    qualityGrade: string;
  }) => void;
}

const AssessmentModal: React.FC<AssessmentModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
}) => {
  const [actualWeight, setActualWeight] = useState<string>("");
  const [moistureContent, setMoistureContent] = useState<string>("");
  const [qualityGrade, setQualityGrade] = useState<string>("");

  const handleSave = () => {
    const details = {
      actualWeight,
      moistureContent,
      qualityGrade,
    };

    // Call the onSave prop to pass data to parent
    onSave(details);

    // Clear the input fields and close the modal
    setActualWeight("");
    setMoistureContent("");
    setQualityGrade("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-5/6">
          <Text className="text-lg font-pbold mb-4 text-primary">
            Assessment Details
          </Text>
          <Text className="text-lg font-pbold mb-4 ">{item.owner}</Text>

          {/* Actual Weight Input */}
          <View className="mb-4">
            <Text className="text-sm font-psemibold">Actual Weight (kg):</Text>
            <TextInput
              value={actualWeight}
              onChangeText={setActualWeight}
              keyboardType="numeric"
              placeholder="Enter Actual Weight"
              className="border border-gray-200 rounded p-2 mt-2"
            />
          </View>

          {/* Moisture Content Input */}
          <View className="mb-4">
            <Text className="text-sm font-psemibold">
              Moisture Content (%):
            </Text>
            <TextInput
              value={moistureContent}
              onChangeText={setMoistureContent}
              keyboardType="numeric"
              placeholder="Enter Moisture Content"
              className="border border-gray-300 rounded p-2 mt-2"
            />
          </View>

          {/* Quality Grade Input */}
          <View className="mb-4">
            <Text className="text-sm font-psemibold">Quality Grade:</Text>
            <TextInput
              value={qualityGrade}
              onChangeText={setQualityGrade}
              placeholder="Enter Quality Grade"
              className="border border-gray-300 rounded p-2 mt-2"
            />
          </View>

          {/* Save and Cancel Buttons */}
          <View className="flex-row justify-end mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="bg-transparent rounded px-4 py-2 mr-4"
            >
              <Text className="text-primary font-psemibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="bg-primary rounded px-4 py-2"
            >
              <Text className="text-white font-psemibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AssessmentModal;
