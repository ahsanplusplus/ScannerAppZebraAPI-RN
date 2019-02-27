import React, { Component } from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import { Content } from 'native-base';
import ZebraScanner from 'react-native-zebra-scanner';
import UserAvatar from 'react-native-user-avatar';
import styles from './styles/StartStyle';

class SplashView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        setTimeout(()=>{
            this.props.navigation.navigate('Start');
        },3000)
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


    render() {
        return (
            <Content contentContainerStyle={{
                flex:1,
                justifyContent: 'center',
                alignItems:'center'
            }} style={{backgroundColor: 'skyblue'}}>
                <Image
                    source={require('../icon.png')}
                    style={
                        {
                            height: 100,
                            width: 100,
                        }
                    }
                />
            </Content>
        );
    }
}

export default SplashView;
