import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

//import reportWebVitals from './reportWebVitals';
const domain = "dev-tgm42mqm1ksnpbqx.us.auth0.com"
const clientID= "7Vklx9pkZHqEqSEa9DdRi3VKfq2BsVfN"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
  <Auth0Provider
    domain={domain}
    clientId={clientID}
    authorizationParams={{
      redirect_uri: "https://localhost:3000/api/auth/profile",
      audience: "https://dev-tgm42mqm1ksnpbqx.us.auth0.com",
      scope: "openid profile email"
    }}
  >
    <App />
  </Auth0Provider>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

//  https://auth0.com/docs/quickstart/spa/react/01-login