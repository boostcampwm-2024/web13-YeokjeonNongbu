const GetFarmImg = (amount: number) => {
  if (amount < 1000000) {
    return '/step1.png';
  } else if (amount < 10000000) {
    return '/step2.png';
  } else if (amount < 50000000) {
    return '/step3.png';
  } else {
    return '/step4.png';
  }
};

export default GetFarmImg;
