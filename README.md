# Simple Calculator

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Development

- To test out the real-time broadcast feature _locally_:
  - `yarn dev` in one terminal. This will fire up the server (on port 5000) and one client session (on Create React App default port: 3000)
  - `PORT=3001 yarn client` in another terminal. This will open a second client session, running on port 3001. (Of course, you can specify any other port as wished.) Note that this is the command for Linux (and probably macOS as well). For Windows, you'll probably want `set PORT=3001 && yarn client`. 