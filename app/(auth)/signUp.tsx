import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";

import { useState, useRef } from "react";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import PhoneInput from "react-native-phone-number-input";
import CheckBox from "react-native-check-box";

const signUp = () => {
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
  });
  const [agree, setAgree] = useState(false);

  return (
    <SafeAreaView className="bg-off-100 h-full">
      <ScrollView className="flex-grow-1">
        <View className="w-full justify-center h-full px-4 py-2">
          <View className="flex-row justify-start mb-2 mt-0">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[350px] h-[70px] mt-0"
            />
          </View>
          <Text className="text-xl text-bold font-psemibold">
            Create Account
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
                    value={form.username}
                    handleChangeText={(e) =>
                      setForm({ ...form, businessname: e })
                    }
                    otherStyles="mt-2 mb-2"
                    keyboardType="default"
                    placeholder="Business Name"
                  />
                  <FormField
                    title="Position"
                    value={form.lastname}
                    handleChangeText={(e) => setForm({ ...form, position: e })}
                    otherStyles="mb-2"
                    keyboardType="default"
                    placeholder="Position"
                  />
                  <FormField
                    title="Address"
                    value={form.lastname}
                    handleChangeText={(e) => setForm({ ...form, address: e })}
                    keyboardType="default"
                    placeholder="Address"
                  />
                  <View className="flex-row justify-between mt-2 w-full mb-5">
                    <View className="flex-1 mr-2">
                      <Text className="mb-1 font-bold">PCA Permit</Text>
                      <TouchableOpacity className="bg-[#59A60E] p-4 rounded-lg items-center">
                        <Text className="text-white font-bold">
                          Upload File
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-1 ml-2">
                      <Text className="mb-1 font-bold">Mayor's Permit</Text>
                      <TouchableOpacity className="bg-[#59A60E] p-4 rounded-lg items-center">
                        <Text className="text-white font-bold">
                          Upload File
                        </Text>
                      </TouchableOpacity>
                    </View>
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

export default signUp;
