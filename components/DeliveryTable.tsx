import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";

const DeliveryTable = () => {
  const [filter, setFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const deliveries = [
    {
      id: "1",
      destination: "hakimbulgogi",
      status: "Pending",
      deliveryDate: "Mon Oct 07 2024",
      weight: 1,
      qrCode: "QR1",
    },
  ];

  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.destination.toLowerCase().includes(filter.toLowerCase())
  );

  const renderItem = ({ item }: { item: (typeof deliveries)[0] }) => (
    <View className="flex-row items-center py-2 border-b border-gray-200">
      <TouchableOpacity
        onPress={() => {
          if (selectedRows.includes(item.id)) {
            setSelectedRows(selectedRows.filter((id) => id !== item.id));
          } else {
            setSelectedRows([...selectedRows, item.id]);
          }
        }}
        className="mr-2"
      >
        <View
          className={`w-5 h-5 border border-gray-400 rounded ${
            selectedRows.includes(item.id) ? "bg-green-500" : ""
          }`}
        />
      </TouchableOpacity>
      <Text className="flex-1">{item.destination}</Text>
      <Text className="flex-1">{item.status}</Text>
      <Text className="flex-1">{item.deliveryDate}</Text>
      <Text className="flex-1">{item.weight}</Text>
      <TouchableOpacity className="bg-green-500 px-3 py-1 rounded">
        <Text className="text-white">View</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-2">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2"
          placeholder="Filter tasks..."
          value={filter}
          onChangeText={setFilter}
        />
        <TouchableOpacity className="border border-gray-300 rounded-lg px-3 py-2">
          <Text>Status</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center py-2 bg-gray-100">
        <Text className="flex-1 font-bold">Destination</Text>
        <Text className="flex-1 font-bold">Status</Text>
        <Text className="flex-1 font-bold">Delivery Date</Text>
        <Text className="flex-1 font-bold">Weight</Text>
        <Text className="w-16 font-bold">Action</Text>
      </View>

      <FlatList
        data={filteredDeliveries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <View className="flex-row justify-between items-center mt-2">
        <Text>
          {selectedRows.length} of {filteredDeliveries.length} row(s) selected.
        </Text>
        <View className="flex-row items-center">
          <Text className="mr-2">Rows per page</Text>
          <TouchableOpacity className="border border-gray-300 rounded px-2 py-1">
            <Text>{rowsPerPage}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-center mt-2">
        <TouchableOpacity className="mx-1">
          <Text>{"<<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mx-1">
          <Text>{"<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mx-1">
          <Text>{">"}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mx-1">
          <Text>{">>"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeliveryTable;
