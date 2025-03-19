import Fab from "@/components/Fab";
import { StyleSheet, Text, View } from "react-native";

const Index = () => {
  return (
    <View style={styles.container}>
      <Text>Index</Text>
      <Fab />
    </View>
  );
};

export default Index;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 82,
  },
});
