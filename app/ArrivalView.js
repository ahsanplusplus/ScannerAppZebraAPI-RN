import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Content, Toast } from 'native-base';
import styles from './styles/StartStyle';
import { TextInput, Button } from 'react-native-paper';
import ZebraScanner from 'react-native-zebra-scanner';
import { Dropdown } from 'react-native-material-dropdown';
import airlines from '../airlines.json';
class ArrivalView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flight_number:'',
            flight_name:'',
            airline_name:''
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
    }
    
    async componentDidMount(){
        let available = await ZebraScanner.isAvailable();
        if(available){
            ZebraScanner.addScanListener(this.scanListener);
        }
    }

    componentWillUnmount(){
        // ZebraScanner.removeScanListener(this.scanListener);
    }

    navigate(route) {
        this.props.navigation.navigate(route, {
            flight_name: this.state.flight_name,
            flight_number: this.state.flight_number,
            airline_name: this.state.airline_name
        })
    }

    render() {
        return (
            <Content contentContainerStyle={styles.view}>
                <Text style={[styles.contents, styles.centerText]}>
                    Scan a code or input flight number and flight name
                </Text>
                <Dropdown
                    label='Airline Name'
                    data={airlines.airlines}
                    onChangeText={(val, index, data) => this.setState({airline_name: val})}
                />
                <TextInput
                    mode='outlined'
                    label='Flight name'
                    value={this.state.flight_name}
                    onChangeText={(flight_name) => this.setState({flight_name})}
                    style={styles.contents}/>
                <TextInput
                    mode='outlined'
                    label='Flight number'
                    value={this.state.flight_number}
                    onChangeText={(flight_number) => this.setState(flight_number)}
                    style={styles.contents}/>
                <Button icon='arrow-forward' mode='contained' style={styles.contents} onPress={() => this.navigate('AddArrival')} >
                    Continue
                </Button>
                <Button icon='home' mode='contained' style={styles.contents} onPress={() => this.navigate('Start')}>
                    Go to home
                </Button>
            </Content>
        );
    }
}

export default ArrivalView;
