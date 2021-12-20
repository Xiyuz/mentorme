import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.css';

import App from "./App.jsx";
import "./config";

// config Amplify
Amplify.configure({
    Auth: {
      // mandatorySignIn: true,
      region: global.amplify.cognito.REGION,
      userPoolId: global.amplify.cognito.USER_POOL_ID,
      // identityPoolId: global.amplify.cognito.IDENTITY_POOL_ID, 
      userPoolWebClientId: global.amplify.cognito.APP_CLIENT_ID
    },
    // Storage: {
    //   region: global.amplify.s3.REGION,
    //   bucket: global.amplify.s3.BUCKET,
    //   identityPoolId: global.amplify.cognito.IDENTITY_POOL_ID
    // },
    API: {
      endpoints: [
        {
          name: "mentorme",
          endpoint: global.amplify.apiGateway.URL,
          region: global.amplify.apiGateway.REGION
        },
      ]
    }
});

ReactDOM.render(<App />, document.getElementById('root'));
