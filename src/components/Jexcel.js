import React, { useRef, useEffect } from 'react';
import { AppContext } from '../context';

import jexcelInit from '../modules/Jexcel.module';

const Jexcel = () => {
  const divRef = useRef(null);
  const { fabricRef, jexcelRef } = React.useContext(AppContext);
  useEffect(() => {
    jexcelRef.current = jexcelInit({ fabricRef, divRef });
    console.log(jexcelRef.current.getData());
  }, []);
  return <div ref={divRef}></div>;
};

export default Jexcel;
