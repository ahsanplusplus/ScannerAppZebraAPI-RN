import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Content, Toast } from 'native-base';
import styles from './styles/StartStyle';
import { TextInput, Button } from 'react-native-paper';
import ZebraScanner from 'react-native-zebra-scanner';
import { black } from 'ansi-colors';

class ArrivalView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flight_number:'',
            flight_name:'',
        };
    }
    scanListener = (scannedCode) => {
        this.setState({
            flight_number: scannedCode
        });
        Toast.show({
            text: 'Captured',
            duration: 3000,
        });
    };
    async componentDidMount(){
        let available = await ZebraScanner.isAvailable();
        if(available){
            ZebraScanner.addScanListener(this.scanListener);
        }
    }

    componentWillUnmount(){
        ZebraScanner.removeScanListener(this.scanListener);
    }

    render() {
        return (
            <Content contentContainerStyle={styles.view}>
                <Text style={[styles.contents, styles.centerText]}>
                    Scan a code or input flight number and flight name
                </Text>
                <TextInput
                    mode='outlined'
                    label='Flight name'
                    onChangeText={(flight_name) => this.setState({flight_name})}
                    style={styles.contents}/>
                <TextInput
                    mode='outlined'
                    label='Flight number'
                    value={this.state.flight_number}
                    onChangeText={(flight_number) => this.setState(flight_number)}
                    style={styles.contents}/>
                <Button icon='arrow-forward' mode='contained' style={styles.contents}>
                    Continue
                </Button>
            </Content>
        );
    }
}

export default ArrivalView;
