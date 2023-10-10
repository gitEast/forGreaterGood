import React, { PureComponent } from 'react';
import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import HomeRecommend from './pages/HomeRecommend';

export class App extends PureComponent {
  render() {
    return (
      <div className="app">
        <div className="header">
          <h2>header</h2>
          <div className="nav">
            <Link to="/home">Home</Link>
            <NavLink to="/about">About</NavLink>
          </div>
        </div>
        <div className="content">
          <Routes>
            {/* <Route path="/" element={<Home />}></Route> */}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />}>
              <Route path="/home/recommend" element={<HomeRecommend />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route element={<NotFound />} />
          </Routes>
        </div>
        <div className="footer">
          <h2>footer</h2>
        </div>
      </div>
    );
  }
}

export default App;
