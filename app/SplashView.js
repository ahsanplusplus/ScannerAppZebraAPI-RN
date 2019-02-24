import React, { Component } from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import { Content } from 'native-base';
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
