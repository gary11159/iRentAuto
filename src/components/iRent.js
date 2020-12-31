import React from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

function Irent(props) {
    const [coords, setCoords] = React.useState();
    const [locatemessage, setLocateMessgae] = React.useState();
    const [curTab, setCurTab] = React.useState('cur');
    const [radius, setRadius] = React.useState(0.5);

    function locSuccess(position) {
        setCoords(pre => ({ 'lat': position.coords.latitude, 'long': position.coords.longitude }));
        setLocateMessgae(pre => 'success');
    }

    function locError() {
        setLocateMessgae(pre => 'error');
    };

    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition(locSuccess, locError);
    }, [])

    // 自動預約
    function startAutoReserve() {
        let authorToken = document.getElementById('deviceInput').value;
        localStorage.setItem('authorToken', authorToken);
        let data = {
            'authorToken': authorToken,
            'lat': coords.lat,
            'long': coords.long,
            'radius': radius
        }

        fetch('http://127.0.0.1:8000/autoSearch/', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                props.setStatus('busy');
                console.log('Success:', response)
            });
    }

    // input全選
    function handleFocus(event) {
        event.target.select();
    }

    return (
        <>
            <ToggleButtonGroup type="radio" name="options" defaultValue={curTab} style={{ width: '70%' }}>
                <ToggleButton value={'cur'} onClick={() => setCurTab('cur')}>當前位置</ToggleButton>
                <ToggleButton value={'specify'} onClick={() => setCurTab('specify')}>指定位置</ToggleButton>
            </ToggleButtonGroup>
            {curTab === 'cur' &&
                <Container className="maringTop20">
                    {locatemessage === 'success' ?
                        <Container>
                            <Row>
                                當前座標
                            </Row>
                            <Row>
                                {'N: ' + coords.lat.toFixed(3) + ', S: ' + coords.long.toFixed(3)}
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
                                <Button variant="warning" className="maringTop20" onClick={() => startAutoReserve()}>啟動自動預約</Button>
                            </Row>
                        </Container>
                        : <div>無法取得當前位置</div>
                    }
                </Container>
            }
        </>
    );
}

export default Irent
