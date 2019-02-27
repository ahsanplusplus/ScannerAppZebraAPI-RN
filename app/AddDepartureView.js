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
            containerNo: this.props.navigation.getParam('containerNo', '')
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
            tagNo: scannedCode,
        });
        if (this.state.autoAdd) {
            //
            this.storeData();
        }
        this.toast('Captured');
    }

    sqlErrorCB(err){
        this.toast('SQL execution failed' + err.message, 'danger');
    }

    sqlSuccessCB(){
        this.toast('SQL executed successfully', 'success');
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
            txn.executeSql('INSERT INTO departures (containerNo, tagNo) VALUES (:containerNo, :tagNo)', [
                this.state.containerNo,
                this.state.tagNo
            ]);
        }, this.sqlSuccessCB, this.sqlErrorCB);
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
                    Flight: {this.state.containerNo}
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
