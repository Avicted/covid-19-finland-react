## Description
React web app that displays COVID-19 data for Finland.

---

## Development
Install Nodejs LTS and run:
### `npm install`
### `npm start`

Note: This project has also been setup with configurations to run the development environment inside of docker using the Visual Studio Code remote containers extension.

Learn more about remote containers at: https://code.visualstudio.com/docs/remote/containers

---

## .env
rename to .env and fill in the variables

```
# Local data is stored in /src/resources, primarly used in development so that the live servers are not spammed with requests during hotreloading.
REACT_APP_USE_LIVE_DATA_API=false

# Create an account at: https://www.mapbox.com/ and read their documentation to acquire the needed variables.
REACT_APP_MAPBOX_TOKEN=<token_here>
REACT_APP_MAPBOX_STYLE_URL=<mapbox://styles/{id}/{syle_id}>
REACT_APP_MAPBOX_ID=<mapbox_user_id>
```

---

## View the app:

https://finlandcovid.com/

---

### Data source Finland
https://github.com/HS-Datadesk/koronavirus-avoindata

### GeoJson source:
https://github.com/Marantle/KoronaKartta

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
