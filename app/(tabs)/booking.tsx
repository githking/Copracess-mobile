import { View, Text, ScrollView } from "react-native";
import React from "react";
import BookingCalendar from "../../components/BookingCalendar";
import EventSection from "../../components/DeliveryTable";
import TruckSection from "../../components/TruckSection";
import DeliveryTable from "../../components/DeliveryTable";

const booking = () => {
  return (
    <ScrollView className="flex-1 bg-off-100 p-4">
      <BookingCalendar />
      <DeliveryTable />
      <TruckSection />
    </ScrollView>
  );
};

export default booking;
