import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Content, Toast } from 'native-base';
import styles from './styles/StartStyle';
import { TextInput, Button } from 'react-native-paper';
import ZebraScanner from 'react-native-zebra-scanner';

class DepartureView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            containerNo:''
        };
    }

    scanListener = (scannedCode) => {
        this.setState({
            containerNo: scannedCode
        });
        Toast.show({
            text: 'Captured',
            duration: 3000,
        });
    }

    async componentDidMount() {
        let available = await ZebraScanner.isAvailable();
        if (available) {
            ZebraScanner.addScanListener(this.scanListener);
        }
    }

    componentWillUnmount() {
        // ZebraScanner.removeScanListener(this.scanListener);
    }

    navigate(route) {
        this.props.navigation.navigate(route, {
            containerNo: this.state.containerNo,
        })
    }


    render(){
        return (
            <Content contentContainerStyle={styles.view}>
                <Text style={[styles.contents, styles.centerText]}>
                    Scan a code or input container number
                </Text>
                <TextInput
                    mode='outlined'
                    label='Flight name'
                    value={this.state.containerNo}
                    onChangeText={(containerNo) => this.setState({containerNo})}
                    style={styles.contents}/>
                <Button icon='arrow-forward' mode='contained' style={styles.contents} onPress={() =>  this.navigate('AddDeparture')}>
                    Continue
                </Button>
                <Button icon='home' mode='contained' style={styles.contents} onPress={() => this.navigate('Start')}>
                    Go to home
                </Button>
            </Content>
        );
    }
}

export default DepartureView;
