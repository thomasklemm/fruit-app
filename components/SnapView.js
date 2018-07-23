import React from "react";
import { ImageBackground, Text, SafeAreaView, View } from "react-native";
import { Button, ButtonRow } from "../components/Buttons";
import Headline from "../components/Headline";

const SnapView = ({ snap, submitSnap, resetSnap }) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={snap} style={{ width: "100%", height: "100%" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Headline>Your Snap</Headline>
          <ButtonRow>
            <Button onPress={resetSnap}>Back</Button>
            <Button onPress={submitSnap}>Submit</Button>
          </ButtonRow>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default SnapView;
