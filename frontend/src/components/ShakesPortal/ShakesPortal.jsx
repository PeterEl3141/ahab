import React from 'react';
import { Link } from 'react-router-dom';
import './ShakesPortal.css';

const ShakesPortal = () => {
  return (
    <section>
      <Link to="/articleList/shakespeare" className="shakes-tile-link">
        <div className="shakes-tile">
          <div className="shakes-left">
            <img src="/images/shakespeare.png" alt="William Shakespeare" className="shakes-image" />
          </div>
          <div className="shakes-right">
            <h1 className="shakes-title">Reflections on Shakespeare</h1>
            <p>A collection of ramblings on the great writer</p>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default ShakesPortal;
