import { useThemeContext } from "@/hooks/useThemeContext";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Route, usePathname, useRouter } from "expo-router";
import React, { JSX, useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type TabItem = {
  name: string;
  path: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const TAB_ITEMS = [
  {
    name: "Home",
    path: "/home/Index",
    icon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
  },
  {
    name: "Dashboard",
    path: "/dashboard/Index",
    icon: ({ color, size }) => <Feather name="grid" color={color} size={size} />,
  },
  {
    name: "Invoice",
    path: "/invoice/Index",
    icon: ({ color, size }) => <MaterialCommunityIcons name="printer" color={color} size={size} />,
  },
  {
    name: "Profile",
    path: "/profile/Index",
    icon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
  },
];

export default function FooterNav() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.footer}>
      {TAB_ITEMS.map((item) => {
        const isActive = pathname.includes(item.name.toLowerCase());
        return (
          <TabButton
            key={item.name}
            label={item.name}
            icon={item.icon}
            active={isActive}
            onPress={() => router.push(item.path as Route)}
          />
        );
      })}
    </View>
  );
}

type TabButtonProps = {
  label: string;
  icon: (props: { color: string; size: number }) => JSX.Element;
  active: boolean;
  onPress: () => void;
};


function TabButton({ label, icon, active, onPress }: TabButtonProps) {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const liftAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(liftAnimation, {
      toValue: active ? -4 : 0,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  }, [active, liftAnimation]);

  return (
    <Pressable
      style={[
        styles.tabButton,
        active && { borderTopWidth: 3, borderTopColor: "#007aff" },
      ]}
      onPress={onPress}
    >
      <Animated.View style={[styles.content, { transform: [{ translateY: liftAnimation }] }]}>
        {icon({ color: active ? "#007aff" : "#888", size: 22 })}
        <Text style={active ? styles.activeText : styles.inactiveText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function createStyles(
  theme: {
    headText?: string;
    subText?: string;
    background: any;
    tint?: string;
    icon?: string;
    tabIconDefault?: string;
    tabIconSelected?: string;
  },
  colorScheme: string
) {
  return StyleSheet.create<{
  footer: ViewStyle;
  tabButton: ViewStyle;
  content: ViewStyle;
  activeTopBorder: ViewStyle;
  activeText: TextStyle;
  inactiveText: TextStyle;
}>({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    backgroundColor: theme.tint,
    borderTopColor: "#ccc",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    maxWidth: 70,
    // borderWidth : 2,
    paddingTop: 4,
  },
  content: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderTopWidth: 3,
    borderTopColor: "transparent",
  },
  activeTopBorder: {
    borderTopColor: "#007aff",
    width: "100%",
  },
  activeText: {
    color: "#007aff",
    fontSize: 10,
    marginTop: 4,
  },
  inactiveText: {
    display: "none",
  },
});
}

