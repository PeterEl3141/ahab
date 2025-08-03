import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import ContextProvider, { AuthContext } from './Context/AuthContext.jsx';
import App from './App.jsx';
import Home from './Pages/Home/Home.jsx';
import About from './Pages/About/About.jsx';
import Books from './Pages/Books/Books.jsx';
import Music from './Pages/Music/Music.jsx';
import Blog from './Pages/Blog/Blog.jsx';
import NotFound from './Pages/NotFound/NotFound.jsx';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import Unpublished from './Pages/Unpublished/Unpublished.jsx';
import Article from './Pages/Article /Article.jsx';
import ArticleList from './Pages/ArticleList.jsx/ArticleList.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />, 
    children: [
      { index: true, element: <Home /> },
      { path: 'books', element: <Books /> },
      { path: 'music', element: <Music /> },
      { path: 'blog', element: <Blog /> },
      { path: 'about', element: <About /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path:"unpublished", element:<Unpublished />},
      { path:"article/:id", element:<Article />},
      { path:"articleList/:category", element:<ArticleList />},

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);
