import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Filters, FilterModalProps } from "../types/type";

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const periods = [
    "Today",
    "This week",
    "This month",
    "Previous month",
    "This year",
  ];
  const statuses = ["Confirmed", "Pending", "Canceled"];

  const handleApply = () => {
    const filters: Filters = {
      selectedPeriod,
      startDate,
      endDate,
      selectedStatus,
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setSelectedPeriod("");
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedStatus([]);
  };

  const onStartDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-lg p-6 w-full max-w-md">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-pbold">FILTERS</Text>
                <TouchableOpacity onPress={handleClear}>
                  <Text className="text-primary font-psemibold">CLEAR</Text>
                </TouchableOpacity>
              </View>

              <Text className="font-pbold mb-2">PERIOD</Text>
              <View className="flex-row flex-wrap mb-4">
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period}
                    onPress={() => setSelectedPeriod(period)}
                    className={`mr-2 mb-2 px-3 py-1 rounded border  ${
                      selectedPeriod === period
                        ? "bg-primary border-primary"
                        : "border-primary bg-white"
                    }`}
                  >
                    <Text
                      className={
                        selectedPeriod === period ? "text-white" : "text-black"
                      }
                    >
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="font-pbold mb-2">SELECT PERIOD</Text>
              <View className="flex-row justify-between mb-4">
                <TouchableOpacity
                  onPress={() => setShowStartDatePicker(true)}
                  className="flex-row items-center border border-primary rounded px-3 py-1"
                >
                  <FontAwesome
                    name="calendar"
                    size={16}
                    color="green"
                    className="mr-2"
                  />
                  <Text className="ml-2">{formatDate(startDate)}</Text>
                </TouchableOpacity>
                <Text className="self-center">-</Text>
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  className="flex-row items-center border border-primary rounded px-3 py-1"
                >
                  <FontAwesome
                    name="calendar"
                    size={16}
                    color="green"
                    className="mr-2"
                  />
                  <Text className="ml-2">{formatDate(endDate)}</Text>
                </TouchableOpacity>
              </View>

              <Text className="font-pbold mb-2">STATUS</Text>
              <View className="flex-row flex-wrap mb-4">
                {statuses.map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => toggleStatus(status)}
                    className={`mr-2 mb-2 px-3 py-1 rounded border ${
                      selectedStatus.includes(status)
                        ? "bg-primary border-primary"
                        : "border-primary"
                    }`}
                  >
                    <Text
                      className={
                        selectedStatus.includes(status)
                          ? "text-white"
                          : "text-black"
                      }
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleApply}
                className="w-full bg-green-500 rounded-lg py-3 mt-4 bg-primary"
              >
                <Text className="text-white font-pbold text-center ">
                  Show results
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          themeVariant="light"
          accentColor="#22C55E"
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          themeVariant="light"
          accentColor="#22C55E"
        />
      )}
    </Modal>
  );
};

export default FilterModal;
