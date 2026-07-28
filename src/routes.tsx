import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import CreatorDetailPage from './pages/CreatorDetailPage';

export const routes = [
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/creators',
		element: <HomePage />,
	},
	{
		path: '/creator/:id',
		element: <CreatorDetailPage />,
	},
	{
		path: '/creators/:id',
		element: <CreatorDetailPage />,
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
];
