import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './styles/StartStyle';
import { Content, H3, Toast } from 'native-base';
import { TextInput, Button } from 'react-native-paper';
import Dialog from "react-native-dialog";
import RNFS from 'react-native-fs'
import ZebraScanner from 'react-native-zebra-scanner';
// import DataWedgeIntents from 'react-native-datawedge-intents';
import SQLite from 'react-native-sqlite-2';

let db;
class AddArrival extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag_number:'',
            autoAdd: true,
            dialog: false,
            flight_name: this.props.navigation.getParam('flight_name'),
            flight_number: this.props.navigation.getParam('flight_name')
        };
    }

    async componentDidMount() {
        try {
            let available = await ZebraScanner.isAvailable();
            ZebraScanner.addScanListener(this.scanListener);
        } catch (err) {
            this.toast('Error '+err.message, 'danger');
        }
        db = SQLite.openDatabase('data.sqlite', '3', 'Root database', 20000, this.openDBCB, this.DBErrorCB);
    }

    componentWillUnmount() {
        // ZebraScanner.removeScanListener(this.scanListener);
    }

    scanListener = (scannedCode) => {
        this.setState({
            tag_number: scannedCode,
        });
        if (this.state.autoAdd) {
            //
            this.storeData();
        }
        this.toast('Captured');
    }

    sqlErrorCB(err){
        Toast.show({
            text: 'SQL execution failed' + err.message,
            duration: 2500,
            type: 'danger'
        });
    }

    sqlSuccessCB(){
        Toast.show({
            text: 'Data saved successfully',
            duration: 2500
        });
    }

    openDBCB(){
        Toast.show({
            text: 'Database opened',
            duration: 2500
        });
    }

    DBErrorCB(err){
        this.toast('Could not open database. Please re-install the app', 'danger');
    }

    toast(text, type = 'default') {
        Toast.show({
            text: text,
            type: type,
            duration: 2500
        });
    }

    storeData(){
        db.transaction((txn) =>{
            txn.executeSql('INSERT INTO arrivals (flight_no, flight_name, tag_number) VALUES (:flight_no, :flight_name, :tag_number)', [
                this.state.flight_number,
                this.state.flight_name,
                this.state.tag_number
            ]);
        }, this.sqlSuccessCB, this.sqlErrorCB);
    }

    updateAutoAdd(){
        this.setState({autoAdd: true, dialog: false});
    }
    
    navigate(route) {
        this.props.navigation.navigate(route)
    }

    render(){
        return (
            <Content contentContainerStyle={styles.view}>
                <H3 style={[styles.contents, styles.centerText]}>
                    Flight: {this.props.navigation.getParam('flight_name')}
                </H3>
                <H3 style={[styles.contents, styles.centerText]}>
                    Flight number: {this.props.navigation.getParam('flight_number')}
                </H3>
                <Text style={[styles.contents, styles.centerText]}>
                    Add Baggage for this flight
                </Text>
                <TextInput
                    mode='outlined'
                    label='Tag number'
                    value={this.state.tag_number}
                    onChangeText={(tag_number) => this.setState({tag_number})}
                    style={styles.contents}
                />
                <Button icon='add' mode='contained' style={styles.contents} onPress={() => this.storeData()}>
                    Save
                </Button>
                <Button icon='arrow-back' mode='contained' style={styles.contents} onPress={() => this.navigate('Arrivals')}>
                    Go back
                </Button>
                <Button icon='home' mode='contained' style={styles.contents} onPress={() => this.navigate('Start')}>
                    Go to home
                </Button>
                <Dialog.Container visible={this.state.dialog}>
                    <Dialog.Title>
                        Auto save?
                    </Dialog.Title>
                    <Dialog.Description>
                        Save to database immediately after scanner capture?
                    </Dialog.Description>
                    <Dialog.Button label="No" onPress={() => this.setState({dialog: false})}/>
                    <Dialog.Button label="Yes" onPress={() => this.updateAutoAdd()}/>
                </Dialog.Container>
            </Content>
        );
    }
}

export default AddArrival;
