import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './styles/StartStyle';
import { Content, H3, Toast } from 'native-base';
import { TextInput, Button } from 'react-native-paper';
import Dialog from "react-native-dialog";
import ZebraScanner from 'react-native-zebra-scanner';
var SQLite = require('react-native-sqlite-storage')

import SqLite from 'react-native-sqlite-storage';
class AddArrival extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag_number:'',
            autoAdd: false,
            dialog: false,
            flight_name:'',
            flight_number:'',
            db: null
        };
    }

    scanListener = (scannedCode) => {
        this.setState({
            tag_number: scannedCode,
        });
        if (this.state.autoAdd) {
            //save to db
        }
        Toast.show({
            text: 'Captured',
            duration: 3000,
        });
    };

    savetoDb(){

    }

    sqlErrorCB(err){
        this.toast('SQL execution failed'+err.message, 'danger');
    }

    sqlSuccessCB(){
        this.toast('SQL executed successfully', 'success');
    }

    openDBCB(){
        this.toast('Database opened');
    }

    DBErrorCB(err){
        this.toast('Could not open database. Please re-install the app', 'danger');
    }

    toast(text, type = 'default'){
        Toast.show({
            text: text,
            type: type,
            duration: 2500
        })
    }

    async componentDidMount() {
        try {
            let available = await ZebraScanner.isAvailable();
            if (available) {
                ZebraScanner.addScanListener(this.scanListener);
            }
        } catch (err) {
            this.toast('Error '+err.message, 'danger')
        }
        var db = SQLite.openDatabase({name: 'data.sqlite', location: 'default'}, this.openDBCB, this.DBErrorCB );
    }

    componentWillUnmount() {
        ZebraScanner.removeScanListener(this.scanListener);
    }

    updateAutoAdd(){
        this.setState({autoAdd: true, dialog: false});
    }

    render() {
        return (
            <Content contentContainerStyle={styles.view}>
                <H3 style={[styles.contents, styles.centerText]}>
                    Flight: {this.state.flight_name}
                </H3>
                <H3 style={[styles.contents, styles.centerText]}>
                    Flight number: {this.state.flight_number}
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
                <Button icon='add' mode='contained' style={styles.contents}>
                    Save
                </Button>
                <Button icon='arrow-back' mode='contained' style={styles.contents}>
                    Go back
                </Button>
                <Dialog.Container visible={this.state.dialog}>
                    <Dialog.Title>
                        Auto save?
                    </Dialog.Title>
                    <Dialog.Description>
                        Save to database immediately after scanner capture?
                    </Dialog.Description>
                    <Dialog.Button label="Yes" onPress={() => this.updateAutoAdd()}/>
                    <Dialog.Button label="No" onPress={() => this.setState({dialog: false})}/>
                </Dialog.Container>
            </Content>
        );
    }
}

export default AddArrival;
