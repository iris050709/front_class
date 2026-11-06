import { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import SideMenu from "../components/SideMenu";
export default function HomeScreen() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() =>
                        setMenuOpen(true)
                    }
                >
                    <Text style={styles.menuIcon}>
                        ☰
                    </Text>
                </TouchableOpacity>

                <Text style={styles.greeting}>
                    Hola, Ana 👋
                </Text>

                <Text style={styles.profile}>
                    👤
                </Text>

            </View>

            <View style={styles.content}>
                <Text style={styles.title}>
                    ¡Bienvenida!
                </Text>

                <Text style={styles.subtitle}>
                    Nos alegra verte nuevamente.
                </Text>
            </View>

            <SideMenu
                visible={menuOpen}
                onClose={() =>
                    setMenuOpen(false)
                }
            />
        </View>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },

    header: {
        height: 70,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        elevation: 3,
    },

    menuIcon: {
        fontSize: 28,
        color: "#1F2937",
    },

    greeting: {
        flex: 1,
        marginLeft: 20,
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },

    profile: {
        fontSize: 25,
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
    },
});