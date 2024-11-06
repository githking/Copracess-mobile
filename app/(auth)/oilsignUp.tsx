// app/(auth)/oilsignUp.tsx
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useState } from "react";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CheckBox from "react-native-check-box";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import cld from "@/lib/cloudinary";
import axios from "axios";

import { upload } from "cloudinary-react-native";

const oilsignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    firstname: "",
    middlename: "",
    lastname: "",
    businessname: "",
    position: "",
    address: "",
    phone: "",
    permitUrl: "",
    role: "OIL_MILL_MANAGER",
  });
  const [agree, setAgree] = useState(false);
  const [permitImage, setPermitImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPermitImage(result.assets[0].uri);
    }
  };

  type UploadImageResponse = string | null;

  const uploadImage = async (): Promise<UploadImageResponse> => {
    if (!permitImage) {
      return null;
    }

    const options = {
      upload_preset: "copracess",
      unsigned: true,
    };

    return new Promise((resolve) => {
      upload(cld, {
        file: permitImage,
        options: options,
        callback: (error: any, response: any) => {
          if (error) {
            console.error("Upload error:", error);
            resolve(null);
          } else if (response) {
            console.log(response);
            resolve(response.url);
          }
        },
      });
    });
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    if (
      !form.firstname ||
      !form.middlename ||
      !form.lastname ||
      !form.businessname ||
      !form.position ||
      !form.address ||
      !form.phone ||
      !form.email ||
      !form.password ||
      !form.username
    ) {
      Alert.alert("error", "Please fill in all fields.");
      return;
    }

    if (permitImage === null) {
      Alert.alert(
        "Please fill in all fields.",
        "Please add a business permit."
      );
      return;
    }

    if (!agree) {
      Alert.alert(
        "Please fill in all fields.",
        "Please agree the terms and conditions."
      );
      return;
    }

    setIsSubmitting(true);

    const permitUrl = await uploadImage();
    if (permitUrl === null) {
      Alert.alert("Error", "Failed to upload business permit.");
      setIsSubmitting(false);
      return;
    }

    const updatedForm = {
      ...form,
      permitUrl: permitUrl,
    };

    console.log("Updated form :", updatedForm);

    try {
      const response = await axios.post("/register", updatedForm);
      console.log("Registration successful:", response.data);
      Alert.alert(
        "Success",
        "Registration successful! Please check your email for activation."
      );
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed. Please try again.");
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            marginBottom={20}
          >
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
              label="Basic Info"
            >
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
              label="Company Info"
            >
              <View className="items-center">
                <View className="items-center mb-7 mt-0">
                  <FormField
                    title="Business Name"
                    value={form.businessname}
                    handleChangeText={(e) =>
                      setForm({ ...form, businessname: e })
                    }
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
                        className="border border-gray-100 bg-white p-4 rounded-lg items-center"
                      >
                        <FontAwesome name="upload" size={15} color="#59A60E" />
                        <Text className="text-gray-100 font-psemibold">
                          Upload File
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {permitImage ? (
                      <Image
                        source={{ uri: permitImage }}
                        className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
                      />
                    ) : null}
                  </View>
                </View>
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
              previousBtnDisabled={isSubmitting}
            >
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

export default oilsignUp;
