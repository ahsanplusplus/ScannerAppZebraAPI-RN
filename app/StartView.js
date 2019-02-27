import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Content, Toast } from 'native-base';
import { Button } from 'react-native-paper';
import RNFS from 'react-native-fs'
import styles from './styles/StartStyle';
import ZebraScanner from 'react-native-zebra-scanner';

import { ProgressDialog } from 'react-native-simple-dialogs';

class StartView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    async componentDidMount() {
        try {
            let available = await ZebraScanner.isAvailable();
            ZebraScanner.addScanListener(this.scanListener);
        } catch (err) {
            // this.toast('Error ' + err.message, 'danger');
        }
        // db = SQLite.openDatabase('data.sqlite', '3', 'Root database', 20000, this.openDBCB, this.DBErrorCB);
    }

    componentWillUnmount() {
        // ZebraScanner.removeScanListener(this.scanListener);
    }

    scanListener = (scannedCode) => {
        // this.setState({
        //     tag_number: scannedCode,
        // });
        // if (this.state.autoAdd) {
        //     //
        //     this.storeData();
        // }
        // this.toast('Captured');
    }

    navigate(route){
        this.props.navigation.navigate(route)
    }

    render() {
        return (
        <Content contentContainerStyle={styles.view}>
            <Text style={styles.contents}>Where do we go from here? </Text>
            <Button icon='arrow-forward' mode='contained' style={styles.contents} onPress={() => this.navigate('Arrivals')}>
                Arrivals
            </Button>
            <Button icon='arrow-back' mode='contained' style={styles.contents} onPress={() => this.navigate('Departures')}>
                Departure
            </Button>
            <Button  mode='contained' style={styles.contents} onPress={() => this.exportDB()}>
                Export Database
            </Button>
            <ProgressDialog
                visible={this.state.loading}
                activityIndicatorColor = '#3498db'
                title="Exporting Database"
                message="Please, wait..."
            />
        </Content>
        );
    }
    exportDB(){
        var app = this;
        this.setState({loading: true})
        var sourcePath = RNFS.ExternalDirectoryPath.replace('files', 'data.sqlite');
        var destPath = RNFS.ExternalStorageDirectoryPath+'/Scanner/database/data.sqlite';
        RNFS.copyFileAssets('www/data.sqlite', sourcePath)
        .then(() => {
            app.setState({loading: false})
            Toast.show({
                text: 'Database copied successfully!',
                duration: 2500
            })
        }).catch((err) => {
            app.setState({loading: false})
            Toast.show({
                text: 'Could not copy database',
                duration: 2500,
                type:'danger'
            })
        })  
    }
}

export default StartView;
