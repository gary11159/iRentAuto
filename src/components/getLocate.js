import React from 'react';
import { geolocated } from "react-geolocated";

class GetLocate extends React.Component {

    componentDidUpdate() {
        console.log(this.props)
        if (!this.props.isGeolocationAvailable) {
            this.props.setLocateMessgae('Not support');
        } else if (!this.props.isGeolocationEnabled) {
            this.props.setLocateMessgae('Not enable');
        } else {
            this.props.setCoords(this.props.coords);
        }
    }

    render() {
        return !this.props.isGeolocationAvailable ? (
            <div>Your browser does not support Geolocation</div>
        ) : !this.props.isGeolocationEnabled ? (
            <div>Geolocation is not enabled</div>
        ) : null
    }
}

export default geolocated()(GetLocate);

