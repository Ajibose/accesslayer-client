import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import CreatorDetailPage from './pages/CreatorDetailPage';
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import FollowingPage from './pages/FollowingPage';

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
		path: '/creator/:id/dashboard',
		element: <CreatorDashboardPage />,
	},
	{
		path: '/creators/:id/dashboard',
		element: <CreatorDashboardPage />,
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
		path: '/following',
		element: <FollowingPage />,
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
];
