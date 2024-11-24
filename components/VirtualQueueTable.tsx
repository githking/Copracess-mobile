// VirtualQueueTable.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    SafeAreaView,
} from "react-native";
import { icons, images } from "@/constants";
import SearchInput from "./SearchInput";
import FilterModal from "./FilterModal";
import type { VirtualQueueItem, Filters } from "@/types/type";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import AssessmentCard from "@/components/AssessmentCard";
import AssessmentModal from "@/components/AssessmentModal";

const VirtualQueueFlatList: React.FC = () => {
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [queue, setQueue] = useState<VirtualQueueItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { authState } = useAuth();

    const fetchQueue = async () => {
        if (!authState?.accessToken) {
            setLoading(false);
            setError("Authentication required");
            return;
        }

        try {
            const response = await axios.get("/queue", {
                headers: {
                    Authorization: `Bearer ${authState.accessToken}`,
                },
            });
            console.log("Queue data:", response.data);
            setQueue(response.data.queue || []); // Ensure queue is always an array
            setError(null);
        } catch (err: any) {
            console.error("Error fetching queue:", err);
            setError(
                err.response?.data?.details || "Failed to fetch queue data"
            );
            setQueue([]); // Reset queue on error
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, [authState?.accessToken]);

    const onRefresh = () => {
        console.log("Manual refresh triggered");
        setRefreshing(true);
        fetchQueue();
    };

    const handleOpenFilterModal = () => {
        setIsFilterModalVisible(true);
    };

    const handleCloseFilterModal = () => {
        setIsFilterModalVisible(false);
    };

    const handleApplyFilters = (filters: Filters) => {
        console.log("Filters applied:", filters);
        handleCloseFilterModal();
        // Apply filters to queue if needed
    };

    // const renderItem = ({
    //     item,
    //     index,
    // }: {
    //     item: VirtualQueueItem;
    //     index: number;
    // }) => (
    //     <View
    //         className={`bg-white rounded-lg p-3 mb-2 flex-row ${
    //             index === 0 ? "border-2 border-secondary-100" : ""
    //         }`}
    //     >
    //         <View className="w-1/5 justify-center">
    //             <Text className="text-lg font-bold text-primary">
    //                 #{item.id}
    //             </Text>
    //             <Text className="text-xs text-gray-500">{item.time}</Text>
    //         </View>
    //         <View className="w-2/5 justify-center">
    //             <Text className="text-sm font-semibold">{item.owner}</Text>
    //             <Text className="text-xs text-gray-500">
    //                 {item.plateNumber}
    //             </Text>
    //         </View>
    //         <View className="w-2/5 items-end justify-center">
    //             <Text className="text-sm">{item.date}</Text>
    //             {index === 0 && (
    //                 <Text className="text-xs text-secondary-200 font-semibold">
    //                     Currently Unloading
    //                 </Text>
    //             )}
    //         </View>
    //     </View>
    // );

    const ListHeaderComponent = () => (
        <View className="flex-row items-center mb-4">
            <View className="flex-1 mr-2">
                <SearchInput icon={icons.search} handlePress={() => {}} />
            </View>
            <TouchableOpacity
                onPress={handleOpenFilterModal}
                className="bg-white p-2 rounded"
            >
                <Image
                    source={icons.filter}
                    className="w-6 h-6"
                    style={{ tintColor: "#59A60E" }}
                />
            </TouchableOpacity>
        </View>
    );

    const ListEmptyComponent = () => (
        <View className="flex flex-col items-center justify-center">
            {!loading ? (
                <>
                    <Image
                        source={images.empty}
                        className="w-40 h-40"
                        alt="No queue items found"
                        resizeMode="contain"
                    />
                    <Text className="text-sm text-white my-5">
                        {error || "No queue items found"}
                    </Text>
                </>
            ) : (
                <ActivityIndicator size="small" color="#59A60E" />
            )}
        </View>
    );

    const ListFooterComponent = () =>
        queue.length > 0 ? (
            <View className="flex-row justify-between mt-4">
                <TouchableOpacity className="bg-white rounded-lg px-6 py-2">
                    <Text className="text-primary font-medium">PREVIOUS</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white rounded-lg px-6 py-2">
                    <Text className="text-primary font-medium">NEXT</Text>
                </TouchableOpacity>
            </View>
        ) : null;

    const [isAssessmentModalVisible, setIsAssessmentModalVisible] =
        useState(false); // For assessment modal
    const [selectedItem, setSelectedItem] = useState<VirtualQueueItem | null>(
        null
    );

    const handleCardPress = (item: VirtualQueueItem) => {
        setSelectedItem(item);
        setIsAssessmentModalVisible(true);
    };

    // Function to close the assessment modal
    const handleCloseAssessmentModal = () => {
        setIsAssessmentModalVisible(false);
        setSelectedItem(null);
    };

    const handleSaveAssessment = (details: {
        actualWeight: string;
        moistureContent: string;
        qualityGrade: string;
    }) => {
        console.log("Selected Item:", selectedItem);
        console.log("Saved Assessment Details:", details);
        handleCloseAssessmentModal();
    };

    return (
        <>
            <SafeAreaView className="bg-primary flex-1 rounded-lg">
                <FlatList
                    data={queue}
                    renderItem={({ item, index }) => (
                        <AssessmentCard
                            item={item}
                            index={index}
                            onPress={() => handleCardPress(item)}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={ListHeaderComponent}
                    ListFooterComponent={ListFooterComponent}
                    ListEmptyComponent={ListEmptyComponent}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#59A60E"]} // Android
                            tintColor="#59A60E" // iOS
                        />
                    }
                />

                <FilterModal
                    visible={isFilterModalVisible}
                    onClose={handleCloseFilterModal}
                    onApplyFilters={handleApplyFilters}
                />
            </SafeAreaView>

            {selectedItem && (
                <AssessmentModal
                    visible={isAssessmentModalVisible}
                    item={selectedItem}
                    onClose={handleCloseAssessmentModal}
                    onSave={handleSaveAssessment}
                />
            )}
        </>
    );
};

export default VirtualQueueFlatList;
