import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Content } from 'native-base';
import { Button } from 'react-native-paper';
import styles from './styles/StartStyle';
class StartView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
        </Content>
        );
    }
}

export default StartView;
