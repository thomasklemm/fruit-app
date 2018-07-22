import React from "react";
import { Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { Camera, Permissions } from "expo";

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    cameraType: Camera.Constants.Type.back
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  toggleCameraType() {
    const newCameraType =
      this.state.cameraType == Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back;
    this.setState({ cameraType: newCameraType });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <Text>Waiting for access to camera.</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera.</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.cameraType}>
            <SafeAreaView style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  flexDirection: "row"
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignSelf: "flex-end",
                    alignItems: "center"
                  }}
                  onPress={() => this.toggleCameraType()}
                >
                  <Text
                    style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
                  >
                    Flip
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Camera>
        </View>
      );
    }
  }
}
