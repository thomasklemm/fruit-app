import React from "react";
import {
  Alert,
  ImageBackground,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";
import { Camera, Permissions } from "expo";

export default class App extends React.Component {
  state = {
    snap: null
  };

  takeSnap = async camera => {
    const snap = await camera.takePictureAsync();
    this.setState({ snap: snap });
  };

  clearSnap = () => {
    this.setState({ snap: null });
  };

  submitSnap = () => {
    Alert.alert(
      "Submitting snap",
      "We're scanning your photo for some fruit. Please wait..."
    );
  };

  render() {
    const { snap } = this.state;
    if (snap) {
      return (
        <SnapView
          snap={snap}
          onSubmitSnap={this.submitSnap}
          onClearSnap={this.clearSnap}
        />
      );
    } else {
      return <CameraView onTakeSnap={this.takeSnap} />;
    }
  }
}

class CameraView extends React.Component {
  state = {
    hasCameraPermission: null
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return (
        <Text>
          Waiting for camera access. You should see a dialog asking for camera
          permissions in a moment...
        </Text>
      );
    } else if (hasCameraPermission === false) {
      return (
        <Text>
          Camera access doesn't seem to be granted. Please allow camera access..
        </Text>
      );
    } else {
      const { onTakeSnap } = this.props;
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
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.buttonElement}
                  onPress={() => onTakeSnap(this.camera)}
                >
                  <Text style={styles.buttonText}>Snap</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Camera>
        </View>
      );
    }
  }
}

const SnapView = ({ snap, onSubmitSnap, onClearSnap }) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={snap} style={{ width: "100%", height: "100%" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.buttonElement}
              onPress={onClearSnap}
            >
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonElement}
              onPress={onSubmitSnap}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  headline: {
    fontSize: 24,
    color: "black"
  },
  buttonRow: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row"
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
