import React from "react";
import { Text } from "react-native";

const Headline = props => {
  return (
    <Text
      style={{
        alignSelf: "center",
        marginTop: 12,
        fontSize: 42,
        fontWeight: "bold",
        color: "white"
      }}
    >
      {props.children}
    </Text>
  );
};

export default Headline;
