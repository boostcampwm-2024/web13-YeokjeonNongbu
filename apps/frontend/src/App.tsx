import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Intro from '@/pages/Intro';
import Main from '@/pages/Main';
import Lottery from '@/pages/Lottery';
import MyPage from '@/pages/MyPage';
import Ranking from '@/pages/Ranking';
import CropMarket from '@/pages/CropMarket';

const router = createBrowserRouter([
  { path: '/', element: <Intro /> },
  { path: '/main', element: <Main /> },
  { path: '/lottery', element: <Lottery /> },
  { path: '/mypage', element: <MyPage /> },
  { path: '/ranking', element: <Ranking /> },
  { path: '/cropmarket', element: <CropMarket /> }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
