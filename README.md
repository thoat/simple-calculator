# Simple Calculator

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

- Perform simple calculations (add, subtract, multiply, divide) on numbers (integers and floats, both negative and non-negative allowed). This is feasible via the [mathjs](http://mathjs.org/) library.
- Check validity of input expressions before feeding them into `mathjs`.
- Update calculated results in real-time across all open browser tabs or windows.
- Persist result entries over time, although only displaying the last 10 entries.

## Usage

The app requires two environment variables: `DATABASE_URL` and `TABLE_NAME` which indicate where to fetch and save your evaluated math
expressions. From the project's root directory, `cp .env.sample .env` then replace the correct credentials to the placeholders.

## Run

Assuming you have _already_ followed the notes under [Usage](#usage).

- Development mode: (the app will auto-open a browser window or tab at http://localhost:3000)

```
yarn
yarn dev
```

- Production mode: (you will have to manually open http://localhost:5000 in your browser once the app starts)

```
yarn
yarn build
NODE_ENV=production yarn start # note to self: replacing `yarn start` with `heroku local` does the same thing
```

## Development

- To test out the real-time broadcast feature _locally_:
  - `yarn dev` in one terminal. This will fire up the server (on port 5000) and one client session (on Create React App default port: 3000)
  - `PORT=3001 yarn client` in another terminal. This will open a second client session, running on port 3001. (Of course, you can specify any other port as wished.) Note that this is the command for Linux (and probably macOS as well). For Windows, you'll probably want `set PORT=3001 && yarn client`. 
