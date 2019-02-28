import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './styles/StartStyle';
import { Content, H3, Toast } from 'native-base';
import { TextInput, Button } from 'react-native-paper';
import Dialog from "react-native-dialog";
import ZebraScanner from 'react-native-zebra-scanner';
// import DataWedgeIntents from 'react-native-datawedge-intents';
import SQLite from 'react-native-sqlite-2';

class AddDepartureView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoAdd: true,
            dialog: false,
            tagNo:'',
            containerNo: ''
        };
    }

    async componentDidMount() {
        this.setState({
            containerNo: this.props.navigation.getParam('containerNo')
        })
        try {
            let available = await ZebraScanner.isAvailable();
            ZebraScanner.addScanListener(this.scanListener);
        } catch (err) {
            this.toast('Error '+err.message, 'danger');
        }
        db = SQLite.openDatabase('db.sqlite', '3', 'Root database', 20000, this.openDBCB, this.DBErrorCB);
    }

    componentWillUnmount() {
        // ZebraScanner.removeScanListener(this.scanListener);
    }

    createTable(){
        var qry = "CREATE TABLE IF NOT EXISTS arrivals ( id INTEGER PRIMARY KEY ASC AUTOINCREMENT UNIQUE, flight_no INT(250), flight_name STRING, tag_number INT(250), created_at STRING );"
        db.transaction(txn => {
            txn.executeSql(qry, [])
        })
    }

    scanListener = (scannedCode) => {
        this.setState({
            tagNo: scannedCode,
        });
        if (this.state.autoAdd) {
            //
            this.storeData();
        }
        this.toast('Captured');
    }

    sqlErrorCB(err){
        Toast.show({
            text: 'SQL execution failed',
            type: 'danger',
            duration: 2500
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
        Toast.show({
            text: 'Could not open database. Please re-install the app',
            type: 'danger',
            duration: 2500
        });
    }

    toast(text, type = 'default') {
        Toast.show({
            text: text,
            type: type,
            duration: 2500
        });
    }

    storeData(){
        var st = this.state;
        db.transaction((txn) =>{
            txn.executeSql('INSERT INTO departures (containerNo, tagNo) VALUES (?,?);', 
            [st.containerNo, st.tagNo], this.sqlSuccessCB, this.sqlErrorCB)
        });
    }

    updateAutoAdd(){
        this.setState({autoAdd: true, dialog: false});
    }

    navigate(route) {
        this.props.navigation.navigate(route)
    }

    render() {
        return (
            <Content contentContainerStyle={styles.view}>
                <H3 style={[styles.contents, styles.centerText]}>
                    Container Number: {this.state.containerNo}
                </H3>
                <Text style={[styles.contents, styles.centerText]}>
                    Add Baggage for this container
                </Text>
                <TextInput
                    mode='outlined'
                    label='Tag number'
                    value={this.state.tagNo}
                    onChangeText={(tagNo) => this.setState({tagNo})}
                    style={styles.contents}
                />
                <Button icon='add' mode='contained' style={styles.contents} onPress={() => this.storeData()}>
                    Save
                </Button>
                <Button icon='arrow-back' mode='contained' style={styles.contents} onPress={() => this.navigate('Departures')}>
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

export default AddDepartureView;
