import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});