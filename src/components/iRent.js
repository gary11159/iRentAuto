import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

function Irent(props) {
    const [coords, setCoords] = React.useState();
    const [locatemessage, setLocateMessgae] = React.useState();
    const [radius, setRadius] = React.useState(0.5);
    const [map, setMap] = React.useState(null);

    function locSuccess(position) {
        setCoords(pre => ({ 'lat': position.coords.latitude, 'lng': position.coords.longitude }));
        setLocateMessgae(pre => 'success');
    }

    function locError() {
        setLocateMessgae(pre => 'error');
    };

    React.useEffect(() => {
        initPosition()
    }, [])

    // 自動預約
    function startAutoReserve() {
        let authorToken = document.getElementById('deviceInput').value;
        localStorage.setItem('authorToken', authorToken);
        let data = {
            'authorToken': authorToken,
            'lat': coords.lat,
            'long': coords.lng,
            'radius': radius
        }

        props.setLoadingStatus(true);
        fetch('https://garyapi.herokuapp.com/autoSearch/', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .catch(error => {
                console.error('Error:', error);
                props.setLoadingStatus(false);
            })
            .then(response => {
                props.setStatus('busy');
                props.setLoadingStatus(false);
                console.log('Success:', response)
            });
    }

    // input全選
    function handleFocus(event) {
        event.target.select();
    }

    // 回到當前位置
    function initPosition() {
        navigator.geolocation.getCurrentPosition(locSuccess, locError);
    }

    return (
        <>
            <Container>
                {locatemessage === 'success' ?
                    <Container>
                        <Row>
                            當前座標
                        </Row>
                        <Row>
                            {'N: ' + coords.lat.toFixed(3) + ', S: ' + coords.lng.toFixed(3)}
                        </Row>
                        <Row className="maringTop20">
                            <Col sm={8}>
                                <InputGroup size="lg" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">請輸入AuthorToken</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl id="deviceInput" aria-label="Small" aria-describedby="inputGroup-sizing-sm" defaultValue={localStorage.getItem('authorToken')} onFocus={handleFocus} />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className="maringTop20">
                            <Col sm={8}>
                                <InputGroup size="lg" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>請選擇搜尋半徑(KM)</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control defaultValue={0.5} as="select" custom onChange={(e) => setRadius(e.target.value)} style={{ width: '30%' }}>
                                        <option>0.3</option>
                                        <option>0.5</option>
                                        <option>0.7</option>
                                        <option>1</option>
                                        <option>1.5</option>
                                        <option>2</option>
                                        <option>100</option>
                                    </Form.Control>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <LoadScript
                                googleMapsApiKey={process.env.REACT_APP_EX_APIKEY}
                            >
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '600px' }}
                                    zoom={15}
                                    // Store a reference to the google map instance in state
                                    onLoad={map => setMap(map)}
                                    onClick={e => setCoords(e.latLng.toJSON())}
                                    center={coords}
                                >
                                    <Marker position={coords}>
                                        <InfoWindow >
                                            <div className="infoWindow" style={{ color: 'black' }}>以這裡為基準搜尋</div>
                                        </InfoWindow>
                                    </Marker>
                                </GoogleMap>
                            </LoadScript>
                        </Row>
                        <Row className="maringTop20">
                            <Button variant="info" onClick={() => initPosition()} style={{ marginRight: '20px' }}>回到當前位置</Button>
                            <Button variant="warning" onClick={() => startAutoReserve()}>啟動自動預約</Button>
                        </Row>
                    </Container>

                    : <div>無法取得當前位置</div>
                }
            </Container>
        </>
    );
}

export default Irent
