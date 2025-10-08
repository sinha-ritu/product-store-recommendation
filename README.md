# Product Store Recommendation

This project is a web application that helps users find food items in nearby stores. The user can enter a food item they are looking for, and the application will provide a list of stores with links to search for that item on the respective store's website and a link to the store's location on Google Maps.

## How it Works

The application consists of a React frontend and a Node.js (Express) backend.

-   **Frontend**: A React application provides the user interface for searching. It gets the user's geolocation and sends the search query to the backend.
-   **Backend**: An Express server receives the search query. It uses the OpenAI API to extract the specific food item from the user's query. It then searches a local `stores.json` file to find stores that have a website with a search function. It returns a list of these stores with dynamically generated URLs to search for the item on their sites, as well as a Google Maps link for the store's location.

## Installation

1.  Clone the repository.
2.  Install the dependencies for the server and the client.

    ```bash
    npm install
    ```

3.  Create a `.env` file in the root of the project and add your OpenAI API key:

    ```
    OPENAI_API_KEY='your_openai_api_key_here'
    ```

    If you don't provide an API key, the application will fall back to a simpler, less accurate method of extracting the food item from the search query.

4.  Start the application. This will run the frontend and backend concurrently.

    ```bash
    npm start
    ```

The application will be available at `http://localhost:3000`.

## Packages

The following packages are used in this project:

### Frontend
-   `react`: For building the user interface.
-   `react-dom`: To render React components in the DOM.
-   `react-scripts`: Scripts and configurations used by Create React App.
-   `web-vitals`: For measuring web performance metrics.
-   `@testing-library/react`: For testing React components.

### Backend
-   `express`: Web framework for Node.js.
-   `cors`: To enable Cross-Origin Resource Sharing.
-   `dotenv`: To load environment variables from a `.env` file.
-   `openai`: Node.js library for the OpenAI API.

### Development
-   `concurrently`: To run multiple commands concurrently (in this case, the React app and the Express server).

## Testing

To run the tests for the React application, use the following command:

```bash
npm test
```
