import React from "react";
import titleize from "titleize";
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { Button, ButtonRow } from "../components/Buttons";
import Headline from "../components/Headline";

export default class ResultsView extends React.Component {
  render() {
    const { snap, labels, resetSnap } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={snap}
          style={{ width: "100%", height: "100%" }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <Headline>Results</Headline>
            {!labels && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View style={styles.activityIndicatorContainer}>
                  <ActivityIndicator
                    size="large"
                    color="white"
                    style={styles.activityIndicator}
                  />
                </View>
              </View>
            )}
            {labels && (
              <ScrollView>
                {labels.map(label => (
                  <LabelCard label={label} key={label.description} />
                ))}
              </ScrollView>
            )}
            <ButtonRow>
              <Button onPress={resetSnap}>Take another Snap</Button>
            </ButtonRow>
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }
}

const LabelCard = ({ label }) => {
  const labelName = titleize(label.description);
  const scoreInPercent = Math.floor(label.score * 100);
  return (
    <View style={styles.labelCardContainer}>
      <Text style={styles.labelCardHeadline}>{labelName}</Text>
      <Text style={styles.labelCardScore}>{scoreInPercent}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 6,
    width: 80,
    height: 80
  },
  activityIndicator: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  labelCardContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 6
  },
  labelCardHeadline: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  labelCardScore: {
    alignSelf: "flex-end",
    fontSize: 20,
    fontStyle: "italic",
    color: "white"
  }
});
