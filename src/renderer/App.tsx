import React from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import useIpcReducer, { useIpcDispatch, useIpcListener } from './useIpcReducer';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="run-script" element={<RunScript />} />
        </Route>
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>ScriptKit</h1>
      <div className="Hello">
        <Link to="run-script">Run Script</Link>
      </div>
    </div>
  );
}

type Action = {
  type: string;
  payload: any;
};

function runScriptReducer<State>(state: State, action: Action) {
  switch (action.type) {
    case 'app:waiting_for_input':
      return {
        ...state,
        activeComponent: {
          name: 'CollectInput',
          props: action.payload,
        },
      };
    case 'script:exited':
      return {
        ...state,
        exited: true,
      };
    default:
      return state;
  }
}

function RunScript() {
  const [state, dispatch] = useIpcReducer(runScriptReducer, {});
  React.useEffect(() => {
    dispatch({ type: 'app:run_script' });
  }, [dispatch]);
  if (state.exited) {
    return <Navigate to="/" />;
  }
  switch (state.activeComponent?.name) {
    case 'CollectInput':
      return <CollectInput {...state.activeComponent?.props} />;
    default:
      return <div>Idle</div>;
  }
}

function CollectInput({ placeholder }: { placeholder: string }) {
  const [value, setValue] = React.useState('');
  const dispatch = useIpcDispatch();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({ type: 'collect-input:submitted_input', payload: value });
      }}
    >
      <div>
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
