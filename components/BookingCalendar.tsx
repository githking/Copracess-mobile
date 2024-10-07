import React, { useState } from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";

const BookingCalendar = () => {
  const today = new Date().toISOString().split("T")[0];

  const markedDates = {
    [today]: {
      selected: true,
      selectedColor: "#FFC303",
      customStyles: {
        container: {
          borderRadius: 20,
        },
      },
    },
  };
  return (
    <View className="bg-primary rounded-lg p-4">
      <Calendar
        theme={{
          calendarBackground: "transparent",
          textSectionTitleColor: "#ffffff",
          dayTextColor: "#ffffff",
          todayTextColor: "#000000",
          selectedDayTextColor: "#000000",
          monthTextColor: "#ffffff",
          selectedDayBackgroundColor: "#ffffff",
          arrowColor: "#FFC303",
          textMonthFontSize: 20,
          textMonthFontWeight: "bold",
        }}
        markedDates={markedDates}
        markingType={"custom"}
        enableSwipeMonths={true}
      />
    </View>
  );
};

export default BookingCalendar;
