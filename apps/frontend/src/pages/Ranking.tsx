import { Rank } from '@/types/Index';
import { getTop5, getMyRank } from '@/services/RankApi';
import { useEffect, useState } from 'react';
import { useUser } from '@/components/public/UserContext';

const Ranking: React.FC = () => {
  const [myRank, setMyRank] = useState(0);
  const [rankList, setRankList] = useState<Rank[]>([]);
  const [percentage, setPercentage] = useState<number>(0);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const { nickname, totalAssets } = useUser();

  useEffect(() => {
    const fetchRankList = async () => {
      try {
        const response = await getTop5();
        if (response.success) {
          setRankList(response.top5 || []);
          setError1(null);
        } else {
          setError1(response.message || '데이터 로딩 중 오류가 발생했습니다.');
        }
      } catch {
        setError1('서버와의 연결에 실패했습니다.');
      }
    };

    const fetchMyRank = async () => {
      try {
        const response = await getMyRank();
        if (response.success) {
          setMyRank(response.rank || 0);
          setPercentage(response.percentage);
          setError2(null);
        } else {
          setError2(response.message || '데이터 로딩 중 오류가 발생했습니다.');
        }
      } catch {
        setError2('서버와의 연결에 실패했습니다.');
      }
    };

    fetchRankList();
    fetchMyRank();
  }, []);

  return (
    <main className="flex flex-row justify-center items-center min-h-screen gap-24 select-none">
      <section className="flex flex-col gap-4 z-[10]">
        {error1 ? (
          <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-8 w-[350px]">
            <p className="flex flex-col text-black text-lg font-bold">{error1}</p>
          </div>
        ) : (
          <>
            {rankList.length === 0 ? (
              <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-8 w-[350px]">
                <p className="flex flex-col text-black text-lg font-bold">랭킹 정보가 없습니다.</p>
              </div>
            ) : (
              <>
                {rankList.map((user, idx) => (
                  <article
                    className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-2 w-[350px]"
                    key={idx}
                  >
                    <ul className="w-full">
                      <li className="flex items-center w-full py-2 px-4 gap-4">
                        <span className="flex justify-center items-center w-12 h-12 text-red-soft text-2xl font-bold">
                          {idx === 0 ? (
                            <img src="/first.png" alt="1등" className="w-12 h-12" />
                          ) : idx === 1 ? (
                            <img src="second.png" alt="2등" className="w-12 h-12" />
                          ) : idx === 2 ? (
                            <img src="/third.png" alt="3등" className="w-12 h-12" />
                          ) : (
                            `${idx + 1}`
                          )}
                        </span>
                        <div className="flex flex-col text-black text-lg font-bold">
                          <span>{user.value}</span>
                          <span>￦ {user.score.toLocaleString()}</span>
                        </div>
                      </li>
                    </ul>
                  </article>
                ))}
              </>
            )}
          </>
        )}
      </section>

      <section className="flex flex-col gap-4 z-[10]">
        <article className="flex flex-col text-center items-center bg-light-beige border-4 border-light-pink rounded-2xl w-[350px] gap-8 p-8">
          {error2 ? (
            <div>
              <p className="flex flex-col text-black text-lg font-bold">{error2}</p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-xl font-medium">내등수</p>
                <p className="text-2xl font-bold text-red-soft">
                  {myRank === -1 ? 'UnRank' : myRank}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">상위 {myRank === -1 ? '-' : `${percentage}%`}</p>
              </div>
              <div>
                <p className="text-xl font-semibold">{nickname}</p>
                <p className="text-xl font-semibold">￦ {totalAssets.toLocaleString()}</p>
              </div>
            </>
          )}
        </article>
      </section>
    </main>
  );
};

export default Ranking;
