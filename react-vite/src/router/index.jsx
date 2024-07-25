import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage';
import CurrentUserKids from '../components/CurrentUserKids/CurrentUserKids';
import KidForm from '../components/KidForm/KidForm';
import UpdateKidForm from '../components/KidForm/UpdateKidForm';
import KidDailyLogs from '../components/KidDailyLogs/KidDailyLogs';
import DailyLogForm from '../components/DailyLogForm/DailyLogForm';
import DailyLogDetails from '../components/DailyLogDetails/DailyLogDetails';
import DailyLogUpdateForm from '../components/DailyLogForm/DailyLogUpdateForm';
import SendFriendRequest from '../components/SendFriendRequest/SendFriendRequest';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/your-kids-list",
        element: <CurrentUserKids />,
      },
      {
        path: "/kids/add-new",
        element: <KidForm />,
      },
      {
        path: "/kids/:kidId/update",
        element: <UpdateKidForm />,
      },
      {
        path: "/kids/:kidId/dailyLogs",
        element: <KidDailyLogs />,
      },
      {
        path: "/kids/:kidId/dailyLogs/new",
        element: <DailyLogForm />,
      },
      {
        path: "/dailyLogs/:dailyLogId",
        element: <DailyLogDetails />,
      },
      {
        path: "/dailyLogs/:dailyLogId/update",
        element: <DailyLogUpdateForm />,
      },
      {
        path: "/friendships/new",
        element: <SendFriendRequest />,
      }

    ],
  },
]);