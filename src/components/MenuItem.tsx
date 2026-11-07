import {
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import { MenuItemProps } from "../interfaces/menu.interface";

export default function MenuItem({
    title,
    icon,
    onPress
}: MenuItemProps) {

    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.icon}>
                {icon}
            </Text>

            <Text
                style={[
                    styles.title,
                    {
                        color: colors.text,
                    }
                ]}
            >
                {title}
            </Text>

            <Text
                style={[
                    styles.arrow,
                    {
                        color: isDark ? "#D1D5DB" : colors.secondary,
                    }
                ]}
            >
                ›
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    icon: {
        fontSize: 22,
        width: 40,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
    },
    arrow: {
        fontSize: 24,
        fontWeight: "500",
    },
});