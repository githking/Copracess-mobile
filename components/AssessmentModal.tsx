// components/AssessmentModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import type { VirtualQueueItem } from "@/types/type";

interface AssessmentModalProps {
  visible: boolean;
  item: VirtualQueueItem;
  onClose: () => void;
  onSave: (details: { actualWeight: string; qualityGrade: string }) => void;
}

const QUALITY_GRADES = ["Premium", "Standard", "Low Grade", "Reject"] as const;

const AssessmentModal: React.FC<AssessmentModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
}) => {
  const [actualWeight, setActualWeight] = useState("");
  const [qualityGrade, setQualityGrade] =
    useState<(typeof QUALITY_GRADES)[number]>("Standard");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!actualWeight.trim()) {
      Alert.alert("Error", "Please enter actual weight");
      return false;
    }

    const weight = parseFloat(actualWeight);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert("Error", "Please enter a valid weight");
      return false;
    }

    if (!qualityGrade) {
      Alert.alert("Error", "Please select quality grade");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const details = {
      actualWeight,
      qualityGrade,
    };

    onSave(details);
    resetForm();
  };

  const resetForm = () => {
    setActualWeight("");
    setQualityGrade("Standard");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-5/6">
          <Text className="text-lg font-pbold mb-4 text-primary">
            Assessment Details
          </Text>
          <Text className="text-lg font-pbold mb-4">{item.owner}</Text>

          {/* Actual Weight Input */}
          <View className="mb-4">
            <Text className="text-sm font-psemibold">
              Actual Weight (tons):
            </Text>
            <TextInput
              value={actualWeight}
              onChangeText={setActualWeight}
              keyboardType="decimal-pad"
              placeholder="Enter Actual Weight"
              className="border border-gray-200 rounded p-2 mt-2"
            />
          </View>

          {/* Quality Grade Picker */}
          <View className="mb-4">
            <Text className="text-sm font-psemibold">Quality Grade:</Text>
            <View className="border border-gray-200 rounded mt-2">
              <Picker
                selectedValue={qualityGrade}
                onValueChange={(value) => setQualityGrade(value)}
              >
                {QUALITY_GRADES.map((grade) => (
                  <Picker.Item key={grade} label={grade} value={grade} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-end mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="bg-transparent rounded px-4 py-2 mr-4"
            >
              <Text className="text-primary font-psemibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSubmitting}
              className="bg-primary rounded px-4 py-2"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-psemibold">Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AssessmentModal;
