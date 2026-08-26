import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import CreatorDetailPage from './pages/CreatorDetailPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

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
		path: '/notifications',
		element: <NotificationsPage />,
	},
	{
		path: '/profile',
		element: <ProfilePage />,
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
];
