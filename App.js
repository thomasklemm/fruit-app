import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Alert
} from "react-native";
import { Camera, Permissions } from "expo";

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    cameraType: Camera.Constants.Type.back,
    picture: null
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

  async snapPicture() {
    if (this.camera) {
      const picture = await this.camera.takePictureAsync();
      this.setState({ picture: picture });
    }
  }

  clearPicture() {
    this.setState({ picture: null });
  }

  performScan() {
    Alert.alert("Scanning", "Scanning your photo for fruits. Please wait...");
  }

  render() {
    const { picture, hasCameraPermission } = this.state;
    if (picture !== null) {
      return (
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={picture}
            style={{ width: "100%", height: "100%" }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignSelf: "flex-end",
                    alignItems: "center"
                  }}
                  onPress={() => this.clearPicture()}
                >
                  <Text
                    style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
                  >
                    Retake
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignSelf: "flex-end",
                    alignItems: "center"
                  }}
                  onPress={() => this.performScan()}
                >
                  <Text
                    style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </View>
      );
    } else if (hasCameraPermission === null) {
      return <Text>Waiting for access to camera.</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera.</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.cameraType}
            ref={ref => {
              this.camera = ref;
            }}
          >
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
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignSelf: "flex-end",
                    alignItems: "center"
                  }}
                  onPress={() => this.snapPicture()}
                >
                  <Text
                    style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
                  >
                    Snap
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
