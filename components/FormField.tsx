import { View, Text, TextInput, KeyboardTypeOptions, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { icons } from "../constants";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:<>?~`,.\-\\]).{8,}$/;

const FormField = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    keyboardType,
    editable = true,
    ...props
}: {
    title: string;
    value: string;
    placeholder?: string;
    handleChangeText: (e: string) => void;
    otherStyles?: string;
    keyboardType?: KeyboardTypeOptions;
    editable?: boolean;
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>("");

    const handleTextChange = (e: string) => {
        handleChangeText(e);

        if (title === "Password") {
            if (!passwordPattern.test(e)) {
                setError(
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
                );
            } else {
                setError("");
            }
        }
    };

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-black font-pmedium">{title}</Text>

            <View className="w-full h-16 px-4 bg-white rounded-2xl border-2 border-primary focus:border-secondary flex flex-row items-center">
                <TextInput
                    className="flex-1 text-black font-pregular text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7B7B8B"
                    onChangeText={handleTextChange}
                    secureTextEntry={title === "Password" && !showPassword}
                    {...props}
                    editable={editable}
                />

                {title === "Password" && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            source={!showPassword ? icons.eye : icons.eyeHide}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )}

                
            </View>
            {title === "Password" && error && (
                    <Text className="text-red-500 text-xs">{error}</Text>
                )}
        </View>
    );
};

export default FormField;
