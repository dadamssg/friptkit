import React from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from 'react-router-dom';
import './App.css';
import { useIpcDispatch, useIpcListener } from './useIpcReducer';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ScriptNavigator />}>
          <Route index element={<Home />} />
          <Route
            path="collect-input"
            element={
              <Script>
                <CollectInput />
              </Script>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

function ScriptNavigator() {
  const navigate = useNavigate();
  useIpcListener((action) => {
    if (action.type === 'collect-input:waiting_for_input') {
      navigate('collect-input', { state: action.payload });
    }
  });
  return <Outlet />;
}

function Home() {
  const dispatch = useIpcDispatch();
  return (
    <div>
      <h1>FriptKit</h1>
      <div className="Hello">
        <button
          type="button"
          onClick={() => dispatch({ type: 'app:run_script' })}
        >
          Run Script
        </button>
      </div>
    </div>
  );
}

function Script({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  useIpcListener((action) => {
    if (action.type === 'script:exited') {
      navigate('/');
    }
  });
  return children;
}

function CollectInput() {
  const location = useLocation();
  const [value, setValue] = React.useState('');
  const dispatch = useIpcDispatch();
  useIpcListener((action) => {
    if (action.type === 'collect-input:waiting_for_input') {
      setValue('');
    }
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({ type: 'collect-input:submitted_input', payload: value });
      }}
    >
      <div>
        <input
          placeholder={location.state?.placeholder || ''}
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
