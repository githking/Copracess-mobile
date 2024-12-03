import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Dimensions,
    StyleSheet,
} from "react-native";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CheckBox from "react-native-check-box";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { calculateDistance } from "@/lib/distanceCalculator";

import { upload } from "cloudinary-react-native";
import { cld } from "@/lib/cloudinary";
import { LocationData, Organization, PHILIPPINES_BOUNDS } from "@/types/map.d";

const oilsignUp = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",
        username: "",
        firstname: "",
        middlename: "",
        lastname: "",
        Org_name: "",
        position: "",
        address: "",
        phone: "",
        permitUrl: "",
        latitude: 0,
        longitude: 0,
        role: "OIL_MILL_MANAGER",
    });
    const [agree, setAgree] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userLocation, setUserLocation] = useState<LocationData | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [oilMills, setOilMills] = useState<Organization[]>([]);
    const [filteredMills, setFilteredMills] = useState<Organization[]>([]);
    const [selectedMill, setSelectedMill] = useState<Organization | null>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            setUserLocation(location as LocationData);

            if (oilMills.length > 0) {
                const millsWithDistance = oilMills.map((mill) => ({
                    ...mill,
                    distance: calculateDistance(
                        location.coords.latitude,
                        location.coords.longitude,
                        mill.geolocation.latitude,
                        mill.geolocation.longitude
                    ),
                }));
                setFilteredMills(millsWithDistance);
            }
        })();
    }, [oilMills]);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0].uri) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to select image");
        }
    };

    const uploadImage = async () => {
        if (!image) {
            return;
        }
        const options = {
            upload_preset: "copracess",
            unsigned: true,
        };

        const uploadResponse = await new Promise<any>((resolve, reject) => {
            upload(cld, {
                file: image,
                options: options,
                callback: (error: any, response: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                },
            });
        });
        console.log(uploadResponse.url);

        return uploadResponse.url;
    };

    const handleSubmit = async () => {
        if (
            !form.firstname ||
            !form.lastname ||
            !form.Org_name ||
            !form.position ||
            !form.address ||
            !form.phone ||
            !form.email ||
            !form.password ||
            !form.username
        ) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (!image) {
            Alert.alert("Required Field", "Please add a business permit.");
            return;
        }

        if (!agree) {
            Alert.alert("Terms Required", "Please agree to the terms and conditions.");
            return;
        }

        setIsSubmitting(true);

        try {
            const responseImage = await uploadImage();

            if (!responseImage) {
                throw new Error("Failed to upload business permit");
            }

            const fullName = `${form.firstname} ${form.middlename || ""} ${form.lastname}`.trim();

            const updatedForm = {
                ...form,
                permit: responseImage,
                name: fullName,
            };

            const response = await axios.post("/register", updatedForm);

            Alert.alert(
                "Success",
                "Registration successful! Please check your email for activation."
            );
            router.push("/signIn");
        } catch (error) {
            console.error("Registration error:", error);
            Alert.alert(
                "Error",
                error instanceof Error ? error.message : "Registration failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

    const CustomMarker = useCallback(
        ({ isSelected, name }: { isSelected: boolean; name: string }) => (
            <View>
                <View
                    className={`items-center justify-center ${
                        isSelected ? "bg-primary" : "bg-white"
                    }`}
                    style={styles.markerContainer}>
                    <MaterialCommunityIcons
                        name="store"
                        size={35}
                        color={isSelected ? "#FFFFFF" : "#59A60E"}
                    />
                    <Text
                        className={`text-[10px] font-pbold ${
                            isSelected ? "text-white" : "text-primary"
                        }`}
                        numberOfLines={1}>
                        {name}
                    </Text>
                </View>
                <View
                    className={`w-2 h-2 rotate-45 ${
                        isSelected ? "bg-primary" : "bg-white"
                    } self-center -mt-1`}
                    style={styles.markerArrow}
                />
            </View>
        ),
        []
    );

    const handleMarkerPress = useCallback((mill: Organization) => {
        setSelectedMill(mill);
        setIsBottomSheetVisible(true);

        if (mill.geolocation && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: mill.geolocation.latitude,
                longitude: mill.geolocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }, []);

    const renderMarker = useCallback(
        (mill: Organization) => {
            const isSelected = selectedMill?.id === mill.id;
            return (
                <Marker
                    key={mill.id}
                    coordinate={{
                        latitude: mill.geolocation.latitude,
                        longitude: mill.geolocation.longitude,
                    }}
                    onPress={() => handleMarkerPress(mill)}
                    tracksViewChanges={false}>
                    <CustomMarker isSelected={isSelected} name={mill.name} />
                </Marker>
            );
        },
        [selectedMill, handleMarkerPress, CustomMarker]
    );

    const handlePress = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;

        setForm({
            ...form,
            latitude,
            longitude,
        });

        setSelectedLocation({ latitude, longitude });

        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    };

    return (
        <SafeAreaView className="bg-off-100 h-full">
            <ScrollView className="flex-grow-1">
                <View className="w-full justify-center h-full px-4 py-2">
                    <View className="flex-row items-center mb-2 mt-10">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <FontAwesome name="angle-left" size={30} color="#59A60E" />
                        </TouchableOpacity>
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            className="w-[300px] h-[70px]"
                        />
                    </View>
                    <Text className="text-xl text-bold font-psemibold">
                        Create Oil Mill Account
                    </Text>
                    <ProgressSteps
                        completedProgressBarColor="#59A60E"
                        completedStepIconColor="#59A60E"
                        activeStepIconBorderColor="#59A60E"
                        marginBottom={20}>
                        <ProgressStep
                            nextBtnStyle={{
                                backgroundColor: "#59A60E",
                                borderRadius: 12,
                                minHeight: 62,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: 250,
                                alignSelf: "center",
                                marginTop: 20,
                            }}
                            nextBtnTextStyle={{
                                color: "#FFFFFF",
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                            label="Basic Info">
                            <View className="items-center mb-7 mt-0">
                                <FormField
                                    title="Username"
                                    value={form.username}
                                    handleChangeText={(e) => setForm({ ...form, username: e })}
                                    otherStyles="mt-2"
                                    keyboardType="default"
                                    placeholder="Username"
                                />
                                <View className="flex-row mt-2 mb-4 w-full">
                                    <View className="flex-1 mr-2">
                                        <FormField
                                            title="First name"
                                            value={form.firstname}
                                            handleChangeText={(e) =>
                                                setForm({ ...form, firstname: e })
                                            }
                                            keyboardType="default"
                                            placeholder="First name"
                                        />
                                    </View>
                                    <View className="flex-1 ml-2">
                                        <FormField
                                            title="Middle Name"
                                            value={form.middlename}
                                            handleChangeText={(e) =>
                                                setForm({ ...form, middlename: e })
                                            }
                                            keyboardType="default"
                                            placeholder="Middle name"
                                        />
                                    </View>
                                </View>
                                <FormField
                                    title="Last Name"
                                    value={form.lastname}
                                    handleChangeText={(e) => setForm({ ...form, lastname: e })}
                                    keyboardType="default"
                                    placeholder="Last name"
                                />
                            </View>
                        </ProgressStep>

                        <ProgressStep
                            nextBtnStyle={{
                                backgroundColor: "#59A60E",
                                borderRadius: 12,
                                minHeight: 62,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: 100,
                            }}
                            nextBtnTextStyle={{
                                color: "#FFFFFF",
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                            previousBtnStyle={{
                                backgroundColor: "#59A60E",
                                borderRadius: 12,
                                minHeight: 62,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: 100,
                            }}
                            previousBtnTextStyle={{
                                color: "#FFFFFF",
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                            label="Company Info">
                            <View className="items-center">
                                <View className="items-center mb-7 mt-0">
                                    <FormField
                                        title="Business Name"
                                        value={form.Org_name}
                                        handleChangeText={(e) => setForm({ ...form, Org_name: e })}
                                        otherStyles="mt-2 mb-2"
                                        keyboardType="default"
                                        placeholder="Business Name"
                                    />
                                    <FormField
                                        title="Position"
                                        value={form.position}
                                        handleChangeText={(e) => setForm({ ...form, position: e })}
                                        otherStyles="mb-2"
                                        keyboardType="default"
                                        placeholder="Position"
                                    />
                                    <FormField
                                        title="Address"
                                        value={form.address}
                                        handleChangeText={(e) => setForm({ ...form, address: e })}
                                        keyboardType="default"
                                        placeholder="Address"
                                    />
                                    <View className="flex-row justify-between mt-2 w-full mb-5">
                                        <View className="flex-1 mr-2">
                                            <Text className="mb-1 font-bold">Business Permit</Text>
                                            <TouchableOpacity
                                                onPress={pickImage}
                                                className="border border-gray-100 bg-white p-4 rounded-lg items-center">
                                                <FontAwesome
                                                    name="upload"
                                                    size={15}
                                                    color="#59A60E"
                                                />
                                                <Text className="text-gray-100 font-psemibold">
                                                    Upload File
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        {image ? (
                                            <Image
                                                source={{ uri: image }}
                                                className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
                                            />
                                        ) : null}
                                    </View>
                                </View>
                            </View>
                        </ProgressStep>

                        <ProgressStep
                            label="Business location"
                            nextBtnStyle={{
                                backgroundColor: "#59A60E",
                                borderRadius: 12,
                            }}
                            previousBtnStyle={{
                                backgroundColor: "#59A60E",
                                borderRadius: 12,
                            }}>
                            <View className="items-center mb-7">
                                <Text className="mb-2 font-bold">Select Business Location</Text>
                                <MapView
                                    ref={mapRef}
                                    initialRegion={PHILIPPINES_BOUNDS}
                                    style={{ width: screenWidth, height: screenHeight - 250 }}
                                    showsUserLocation={true}
                                    showsMyLocationButton={true}
                                    onPress={handlePress}>
                                    {userLocation && (
                                        <Marker
                                            coordinate={{
                                                latitude: userLocation.coords.latitude,
                                                longitude: userLocation.coords.longitude,
                                            }}
                                            title="Your Location">
                                            <View className="bg-blue-500 p-2 rounded-full">
                                                <MaterialCommunityIcons
                                                    name="map-marker-account"
                                                    size={24}
                                                    color="#FFFFFF"
                                                />
                                            </View>
                                        </Marker>
                                    )}
                                    {Array.isArray(filteredMills) &&
                                        filteredMills.map(renderMarker)}

                                    {selectedLocation && (
                                        <Marker
                                            coordinate={selectedLocation}
                                            title="Selected Location">
                                            <View
                                                style={{
                                                    backgroundColor: "red",
                                                    padding: 5,
                                                    borderRadius: 20,
                                                }}>
                                                <MaterialCommunityIcons
                                                    name="map-marker"
                                                    size={24}
                                                    color="#FFFFFF"
                                                />
                                            </View>
                                        </Marker>
                                    )}
                                </MapView>
                                <Text className="mt-2">
                                    Latitude: {form.latitude}, Longitude: {form.longitude}
                                </Text>
                            </View>
                        </ProgressStep>

                        <ProgressStep
                            nextBtnStyle={{
                                backgroundColor: "#59A60E",
                                borderRadius: 12,
                                minHeight: 62,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: 100,
                            }}
                            nextBtnTextStyle={{
                                color: "#FFFFFF",
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                            previousBtnStyle={{
                                backgroundColor: "#59A60E",
                                borderRadius: 12,
                                minHeight: 62,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: 100,
                            }}
                            previousBtnTextStyle={{
                                color: "#FFFFFF",
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                            label="Login Info"
                            onSubmit={handleSubmit}
                            nextBtnDisabled={isSubmitting}
                            previousBtnDisabled={isSubmitting}>
                            <View className="items-center mb-4">
                                <FormField
                                    title="Email Address"
                                    value={form.email}
                                    handleChangeText={(e) => setForm({ ...form, email: e })}
                                    otherStyles="mt-2 mb-2"
                                    keyboardType="email-address"
                                    placeholder="Enter your email address"
                                />
                                <FormField
                                    title="Phone number"
                                    value={form.phone}
                                    handleChangeText={(e) => setForm({ ...form, phone: e })}
                                    otherStyles="mt-2 mb-2"
                                    keyboardType="numeric"
                                    placeholder="63+"
                                />
                                <FormField
                                    title="Password"
                                    value={form.password}
                                    handleChangeText={(e) => setForm({ ...form, password: e })}
                                    otherStyles="mb-1"
                                    placeholder="Enter password"
                                />
                            </View>
                            <View className="flex-row ">
                                <CheckBox
                                    isChecked={agree}
                                    onClick={() => setAgree(!agree)}
                                    checkBoxColor="#59A60E"
                                    uncheckedCheckBoxColor="#080807"
                                />
                                <Text className="ml-2 mb-6">
                                    I agree to the terms and conditions
                                </Text>
                            </View>
                        </ProgressStep>
                    </ProgressSteps>
                    <View className="flex-row justify-center items-center mt-5 mb-10">
                        <Text>Already Have an Account?</Text>
                        <Link className="text-primary ml-2" href="/signIn">
                            Login
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 50,
        height: 50,
        borderRadius: 8,
        padding: 4,
    },
    markerArrow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default oilsignUp;
