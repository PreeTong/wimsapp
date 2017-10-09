import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class DetailsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stt:'Loading...',
            act: 'Loading...',
            cre:'Loading...',
            exp:'Loading...',
            ino:'Loading...',
            nmc:'Loading...',
            owg:'Loading...',
            own:'Loading...',
            sev:'Loading...',
            sit:'Loading...',
            stu:'Loading...',
            sum:'Loading...',
            type:'Loading...',
        };
    }

    static navigationOptions = {
        title: 'DETAILS',
    };

    componentDidMount() {
        const { navigate } = this.props.navigation;
        const navParams = this.props.navigation.state.params;
        if(!navParams.params) return false;
        return this._handlePress(navParams.params)
    }

    _handlePress(_act) {

        return fetch('http://iisct.info/api/ticket', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                own: '',
                getLog: _act,
              })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.ticket_fields);
                let res = responseJson.ticket_fields[0];
                this.setState({ 
                    stt:res.stt,
                    act:res.act,
                    cre:res.cre,
                    exp:res.exp,
                    ino:res.ino,
                    nmc:res.nmc,
                    owg:res.owg,
                    own:res.own,
                    sev:res.sev,
                    sit:res.sit,
                    stu:res.stu,
                    sum:res.sum,
                    type:res.type,
                 })
            })
            .catch((error) => {
                this.setState({ act:'NotFound' })
                console.error(error);
            });
    }


    render() {
        return (
            <View>
                <Text>Ticket : {this.state.stt}</Text>
                <Text>Activity : {this.state.act}</Text>
                <Text>Fault Details : {this.state.sum}</Text>
                <Text>Site : {this.state.sit}</Text>
                <Text>Owner Group : {this.state.owg}</Text>
                <Text>Status : {this.state.stu} - {this.state.inoc} | {this.state.nmc} </Text>
                <Text>Type : {this.state.type}</Text>
                <Text>Create Date : {this.state.cre}</Text>
                <Text>Expended Date : {this.state.exp}</Text>
            </View>
        );
    }
}