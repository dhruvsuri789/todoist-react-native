import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const IdPage = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>IdPage: {id}</Text>
    </View>
  );
};

export default IdPage;
const styles = StyleSheet.create({});
