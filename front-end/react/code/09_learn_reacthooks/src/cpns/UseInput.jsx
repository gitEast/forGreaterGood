import React, { memo, forwardRef, useImperativeHandle, useRef } from 'react';

const UseInput = memo(
  forwardRef((props, ref) => {
    const inputRef = useRef();

    useImperativeHandle(ref, () => {
      return {
        focus() {
          inputRef.current.focus();
        }
      };
    });

    return (
      <div>
        <h3>UseInput Component</h3>
        <input ref={inputRef} type="text" />
      </div>
    );
  })
);

export default UseInput;
