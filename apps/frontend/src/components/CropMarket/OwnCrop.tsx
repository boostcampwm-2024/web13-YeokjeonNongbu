const currentCrops = [
  {
    crop: '당근',
    ownedAmount: 23,
    ownedValue: '￦ 200,000',
    profitRate: '+12.5%',
    profitAmount: '￦25,000'
  },
  {
    crop: '사과',
    ownedAmount: 23,
    ownedValue: '￦ 200,000',
    profitRate: '-10.0%',
    profitAmount: '￦-20,000'
  },
  {
    crop: '수박',
    ownedAmount: 23,
    ownedValue: '￦ 200,000',
    profitRate: '+12.5%',
    profitAmount: '￦25,000'
  },
  {
    crop: '포도',
    ownedAmount: 23,
    ownedValue: '￦ 200,000',
    profitRate: '+12.5%',
    profitAmount: '￦25,000'
  },
  {
    crop: '버섯',
    ownedAmount: 23,
    ownedValue: '￦ 200,000',
    profitRate: '+12.5%',
    profitAmount: '￦25,000'
  }
];

const OwnCrop: React.FC = () => {
  return (
    <>
      <table className="h-full w-full md:text-xs lg:text-xs xl:text-sm w-full text-center">
        <thead>
          <tr>
            <th>작물명</th>
            <th>보유수량</th>
            <th>보유가액</th>
          </tr>
        </thead>
        <tbody className="md:h-24 lg:h-26 xl:h-28 ">
          {currentCrops.map(({ crop, ownedAmount, ownedValue }, idx) => (
            <tr key={idx}>
              <td>{crop}</td>
              <td>{ownedAmount}</td>
              <td>{ownedValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default OwnCrop;
