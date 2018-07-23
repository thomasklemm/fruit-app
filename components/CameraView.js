import React from "react";
import { Text, SafeAreaView, View } from "react-native";
import { Camera, ImagePicker, Permissions } from "expo";
import { Button, ButtonRow } from "../components/Buttons";
import Headline from "../components/Headline";

export default class CameraView extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null
  };

  componentWillMount() {
    this.askForCameraPermissions();
  }

  askForCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  askForCameraRollPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === "granted" });
  };

  takeSnap = async camera => {
    const snap = await camera.takePictureAsync({
      quality: 0.15,
      base64: true
    });
    this.props.setSnap(snap);
  };

  pickSnap = async () => {
    await this.askForCameraRollPermissions();
    await this.launchImagePicker();
  };

  launchImagePicker = async () => {
    const snap = await ImagePicker.launchImageLibraryAsync({
      quality: 0.15,
      base64: true
    });

    if (!snap.cancelled) {
      this.props.setSnap(snap);
    } else {
      this.props.resetSnap();
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Text>
            Waiting for camera access. You should see a dialog asking for camera
            permissions in a moment...
          </Text>
        </SafeAreaView>
      );
    } else if (hasCameraPermission === false) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Text>
            Camera access doesn't seem to be granted. Please allow camera
            access..
          </Text>
        </SafeAreaView>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <Headline>Fruit App</Headline>
              <ButtonRow>
                <Button
                  onPress={() => {
                    this.pickSnap();
                  }}
                >
                  Select a Snap
                </Button>
                <Button
                  onPress={() => {
                    this.takeSnap(this.camera);
                  }}
                >
                  Take a Snap
                </Button>
              </ButtonRow>
            </SafeAreaView>
          </Camera>
        </View>
      );
    }
  }
}
