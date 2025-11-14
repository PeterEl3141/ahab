import React from 'react'
import './Mission.css'

const Mission = () => {
  return (
    <section className="mission">
      <h2 className="mission-title">OUR MISSION</h2>

      <div className="mission-content">
        <div className='dict'>
           <p className="dict-head">
          <span className="dict-word">white whale</span>{" "}
          <span className="dict-pos">noun</span>{" "}
          <span className="dict-grammar">[C]</span>{" "}
          <span className="dict-topic">(GOAL)</span>
        </p>

        <p className="dict-meta">[ usually singular ]</p>
        <p className="dict-meta">(also great white whale)</p>

        <p className="dict-def">
          a goal that you are determined to achieve, or something that you are
          determined to get, especially if this is very difficult.
        </p>
        </div>
       
        <p className='mission-explanation'>
          We aim to provide a space for people to document those attempts
          at self-actualisation and transcendence which radiate out a contagious energy, a galvanic impulse 
          to do better, try harder (at whatever you seek to excel in) through pure force of example. 
          Although the general thrust of the platform will be towards publishing articles relating to the humanities,
          those covering scientific topics will also be welcome (provided that a hefty part of the focus is 
          placed on the individuals involved in the scientific process). In other words, this website 
          is unapologetically an ode to those individuals who enrich our reality so much by refracting it
           back through the prism of their own monomania.
          It is a space to celebrate the movers, the shakers, and the chasers of white whales. 
        </p>
      </div>
    </section>
  );
};


export default Mission
