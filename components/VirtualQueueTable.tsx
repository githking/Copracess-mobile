import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { icons } from "../constants";
import SearchInput from "./SearchInput";
import FilterModal from "./FilterModal";
import type { QueueItem, Filters } from "../types/type";

const Trucks: QueueItem[] = [
  {
    id: "246",
    time: "10:38 am",
    plateNumber: "ASD153",
    owner: "Joshua Gonzales",
    date: "4/9/2024",
  },
  {
    id: "247",
    time: "10:40 am",
    plateNumber: "JHC765",
    owner: "King Hezron",
    date: "4/9/2024",
  },
  {
    id: "248",
    time: "10:45 am",
    plateNumber: "ZAC103",
    owner: "Bob Cano",
    date: "4/9/2024",
  },
  {
    id: "249",
    time: "11:05 am",
    plateNumber: "JAB809",
    owner: "Christ David",
    date: "4/9/2024",
  },
  {
    id: "250",
    time: "11:18 am",
    plateNumber: "CLI098",
    owner: "Lemuel Zaldua",
    date: "4/9/2024",
  },
  {
    id: "251",
    time: "11:20 am",
    plateNumber: "HAG721",
    owner: "Joseph Laurel",
    date: "4/9/2024",
  },
  {
    id: "252",
    time: "11:43 am",
    plateNumber: "BAN571",
    owner: "Kalisso Jade",
    date: "4/9/2024",
  },
  {
    id: "253",
    time: "1:30 pm",
    plateNumber: "KAU791",
    owner: "Ken Bento",
    date: "4/9/2024",
  },
  {
    id: "254",
    time: "1:36 pm",
    plateNumber: "BAH112",
    owner: "Richard Canto",
    date: "4/9/2024",
  },
  {
    id: "255",
    time: "1:43 pm",
    plateNumber: "POT612",
    owner: "Rusty Balboa",
    date: "4/9/2024",
  },
  {
    id: "36",
    time: "1:57 pm",
    plateNumber: "KAU118",
    owner: "Jester Yago",
    date: "4/9/2024",
  },
];

const VirtualQueueTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const tableHead = ["#", "TIME", "PLATE NUMBER", "OWNER", "DATE"];
  const widthArr = [40, 80, 100, 140, 80];

  const tableData = Trucks.map((item) => [
    item.id,
    item.time,
    item.plateNumber,
    item.owner,
    item.date,
  ]);

  const handleOpenFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  const handleApplyFilters = (filters: Filters) => {
    console.log("Filters applied:", filters);
    handleCloseFilterModal();
  };

  return (
    <View className="bg-white rounded-lg p-4">
      <View className="flex-row items-center mb-4">
        <View className="flex-1 flex-row items-center ">
          <SearchInput icon={icons.search} handlePress={() => {}} />
        </View>
        <TouchableOpacity className="ml-2" onPress={handleOpenFilterModal}>
          <Image
            source={icons.filter}
            className="w-6 h-6"
            style={{ tintColor: "#59A60E" }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={{ height: 50, backgroundColor: "#FFFFFF" }}
              textStyle={{ textAlign: "center", fontWeight: "bold" }}
            />
            <Rows
              data={tableData}
              widthArr={widthArr}
              style={[{ height: 40 }]}
              textStyle={{ textAlign: "center" }}
            />
          </Table>
        </View>
      </ScrollView>

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity className="bg-white border border-primary rounded-lg px-4 py-2">
          <Text className="text-primary font-pmedium">PREVIOUS</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white border border-primary rounded-lg px-4 py-2">
          <Text className="text-primary font-pmedium">NEXT</Text>
        </TouchableOpacity>
      </View>
      <FilterModal
        visible={isFilterModalVisible}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
      />
    </View>
  );
};

export default VirtualQueueTable;
