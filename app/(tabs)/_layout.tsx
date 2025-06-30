import { Tabs } from "expo-router";
import { FontAwesome, Feather, MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="home"
              size={focused ? 28 : 24}
              color={focused ? "#16a34a" : "#94a3b8"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="user"
              size={focused ? 28 : 24}
              color={focused ? "#16a34a" : "#94a3b8"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="bar-chart"
              size={focused ? 28 : 24}
              color={focused ? "#16a34a" : "#94a3b8"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="config"
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="settings"
              size={focused ? 28 : 24}
              color={focused ? "#16a34a" : "#94a3b8"}
            />
          ),
        }}
      />
    </Tabs>
  );
}