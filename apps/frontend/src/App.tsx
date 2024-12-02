import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Intro from '@/pages/Intro';
import Main from '@/pages/Main';
import Lottery from '@/pages/Lottery';
import MyPage from '@/pages/MyPage';
import Ranking from '@/pages/Ranking';
import CropMarket from '@/pages/CropMarket';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import PrivateRoute from '@/components/ProtectRoute';
import OauthLogin from '@/components/Intro/OauthLogin';
import { UserProvider } from '@/components/public/UserContext';
import { AlertDialog } from './components/public/AlertContext';

interface LayoutProps {
  path: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ path, children }) => {
  return (
    <>
      <Header />
      <motion.div
        key={path}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AlertDialog>
      <div className="bg-bg-color min-h-screen">
        <AnimatePresence>
          <BrowserRouter>
            <UserProvider>
              <Routes>
                <Route path="/" element={<Intro />} />
                <Route path="oauth/redirect" element={<OauthLogin />} />
                <Route
                  path="/main"
                  element={
                    <Layout path="/main">
                      <PrivateRoute element={<Main />} />
                    </Layout>
                  }
                />
                <Route
                  path="/lottery"
                  element={
                    <Layout path="/lottery">
                      <PrivateRoute element={<Lottery />} />
                    </Layout>
                  }
                />
                <Route
                  path="/mypage"
                  element={
                    <Layout path="/mypage">
                      <PrivateRoute element={<MyPage />} />
                    </Layout>
                  }
                />
                <Route
                  path="/ranking"
                  element={
                    <Layout path="/ranking">
                      <PrivateRoute element={<Ranking />} />
                    </Layout>
                  }
                />
                <Route
                  path="/cropmarket"
                  element={
                    <Layout path="/cropmarket">
                      <PrivateRoute element={<CropMarket />} />
                    </Layout>
                  }
                />
              </Routes>
            </UserProvider>
          </BrowserRouter>
        </AnimatePresence>
      </div>
    </AlertDialog>
  );
}

export default App;
