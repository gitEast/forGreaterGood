import React, { memo, useRef } from 'react';
import UseInput from './cpns/UseInput';

const App = memo(() => {
  const inputRef = useRef();

  function operaInput() {
    console.log(inputRef.current);
    inputRef.current.focus();
  }

  return (
    <div>
      <h1>App Page</h1>
      <UseInput ref={inputRef} />
      <button onClick={operaInput}>operate UseInput</button>
    </div>
  );
});

export default App;
