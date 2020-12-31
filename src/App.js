import React from 'react';
import './App.css';
import Irent from './components/iRent';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Spinner from './components/spinner';

function App() {
  const [status, setStatus] = React.useState();
  const [loadingStatus, setLoadingStatus] = React.useState(false);

  React.useEffect(() => {
    init();
  }, [])

  function init() {
    setLoadingStatus(true);
    fetch('https://garyapi.herokuapp.com/checkJobExist/')
      .then(response => response.json())
      .then(data => {
        setLoadingStatus(false);
        setStatus(data.message)
      }).catch(function (response) {
        setStatus('Error');
        setLoadingStatus(false);
        console.log(response);
      })
  }

  function cancelJob() {
    setLoadingStatus(true);
    fetch('https://garyapi.herokuapp.com/cancelAllJob/')
      .then(response => response.json())
      .then(data => {
        setLoadingStatus(false);
        if (data.message === 'Success') {
          init();
        }
      }).catch(function (response) {
        setLoadingStatus(false);
        console.error(response);
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        {loadingStatus &&
          <Spinner />
        }
        {status === 'free' ?
          <Irent setStatus={(status) => setStatus(status)} setLoadingStatus={(status) => setLoadingStatus(status)} />
          : status === 'busy' ?
            <>
              <span>正在進行自動化預約iRent</span>
              <Button variant="danger" className="maringTop20" onClick={() => cancelJob()}>取消預約？</Button>
            </> 
            : null
        }
      </header>
    </div>
  );
}

export default App;
