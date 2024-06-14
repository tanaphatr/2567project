import React from 'react';
import './App.css';
import Nav from './component/nav';
import Home from './component/Home';
import Searchbar from './component/searchbar';
import Catagori from './component/Catagori';
import PageAB from './component/PageAB';


function App() {
  return (
    <body>
      <div>
        <Nav  />
        <Searchbar />
        <Catagori />
        <Home />
        <PageAB />
      </div>
    </body>
  );
}

export default App;
