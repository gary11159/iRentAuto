import React from 'react';
import './App.css';
import Irent from './components/iRent';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

function App() {
  const [status, setStatus] = React.useState();

  React.useEffect(() => {
    init();
  }, [])

  function init() {
    fetch('http://127.0.0.1:8000/checkJobExist/')
      .then(response => response.json())
      .then(data => {
        setStatus(data.message)
      }).catch(function (response) {
        console.log(response);
      })
  }

  function cancelJob() {
    fetch('http://127.0.0.1:8000/cancelAllJob/')
      .then(response => response.json())
      .then(data => {
        if ( data.message === 'Success' ) {
          init();
        }
      }).catch(function (response) {
        console.error(response);
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        {status === 'free' ?
          <Irent setStatus={(status) => setStatus(status)} />
          :
          <>
            <span>正在進行自動化預約iRent</span>
            <Button variant="danger" className="maringTop20" onClick={() => cancelJob()}>取消預約？</Button>
          </>
        }
      </header>
    </div>
  );
}

export default App;
