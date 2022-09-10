import React from 'react';
import { ipcRenderer } from 'electron';

const CHANNEL = 'my-channel';

export function useIpcDispatch() {
  return React.useCallback((action) => ipcRenderer.send(CHANNEL, [action]), []);
}

export function useIpcListener(callback) {
  const cbRef = React.useRef();
  cbRef.current = callback;
  React.useEffect(() => {
    const cb = (_, data) => {
      console.log('useIpcListener', data);
      cbRef.current(data);
    };
    ipcRenderer.on(CHANNEL, cb);
    return () => {
      ipcRenderer.off(CHANNEL, cb);
    };
  }, []);
}

export default function useIpcReducer(reducer, initializerArg) {
  const [state, internalDispatch] = React.useReducer(reducer, initializerArg);
  const dispatchIpc = useIpcDispatch();
  const dispatch = React.useCallback(
    (action) => {
      internalDispatch(action);
      dispatchIpc(action);
    },
    [dispatchIpc]
  );
  // React.useEffect(() => {
  //   const cb = (_, data) => {
  //     console.log('useIpcReducer', data);
  //     internalDispatch(data);
  //   };
  //   ipcRenderer.on(CHANNEL, cb);
  //   return () => {
  //     ipcRenderer.off(CHANNEL, cb);
  //   };
  // }, []);
  useIpcListener(internalDispatch);
  return [state, dispatch];
}
