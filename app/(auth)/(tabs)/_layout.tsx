import { Tabs } from "@/components/Tabs";
import { StyleSheet } from "react-native";

const Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? "calendar.circle.fill" : "calendar.circle",
          }),
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "Upmcoming",
          tabBarIcon: () => ({
            sfSymbol: "calendar",
          }),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? "text.magnifyingglass" : "magnifyingglass",
          }),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? "doc.text.image.fill" : "doc.text.image",
          }),
        }}
      />
    </Tabs>
  );
};

export default Layout;
const styles = StyleSheet.create({});
