import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

export const ButtonRow = ({ children }) => {
  return <View style={styles.buttonRow}>{children}</View>;
};

export const Button = ({ children, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonElement} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignSelf: "flex-end"
  },
  buttonElement: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingTop: 16,
    paddingBottom: 16
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white"
  }
});
