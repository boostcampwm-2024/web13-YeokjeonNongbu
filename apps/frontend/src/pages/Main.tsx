import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Main = () => {
    return (
      <div>
        <Header></Header>
        <h1>메인 페이지</h1>
        <nav>
        <ul>
          <li>
            <Link to="/lottery">복권 페이지</Link>
          </li>
          <li>
            <Link to="/mypage">마이페이지</Link>
          </li>
          <li>
            <Link to="/ranking">랭킹 페이지</Link>
          </li>
          <li>
            <Link to="/cropmarket">작물시장 페이지</Link>
          </li>
        </ul>
      </nav>
      </div>
    );
  };
  
  export default Main;
  