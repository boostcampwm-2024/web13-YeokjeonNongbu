module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 밝은 색 계열
        'bg-color': '#FFFBE6',
        'light-gray': '#FEFEFE',
        'light-beige': '#FFFEF6',
        'light-red': '#FFDEDE',
        'light-yellow': '#FDD692',
        'light-pink': '#FFBDBD',

        // 붉은 색 계열
        'red-alert': '#FF3900',
        'red-light': '#F94949',
        'red-soft': '#FF7B7B',
        'red-dark': '#DE3E30',
        'pure-red': '#FF0000',

        // 갈색 계열
        'brown-dark': '#534646',
        'brown-medium': '#754F44',
        'brown-light': '#A9644C',

        // 회색 계열
        'blue-gray': '#64748B',
        gray: '#C9C9C9',

        // 기타 색상
        black: '#000000',
        coral: '#EC7357'
      },
      backgroundImage: {
        intro: "url('./assets/intro/intro.png')",
        home: "url('./assets/header/home.png')",
        alarm: "url('./assets/header/alarm.png')",
        sideBar: "url('./assets/header/hamburgerBar.png')",
        grass: "url('./assets/public/grass.png')",
        yeok: "url('./assets/intro/yeok.png')",
        jeon: "url('./assets/intro/jeon.png')",
        nong: "url('./assets/intro/nong.png')",
        bu: "url('./assets/intro/bu.png')",
        start: "url('./assets/intro/start.png')",
        cropmarket: "url('./assets/main/cropMarket.png')",
        mypage: "url('./assets/main/myPage.png')",
        ranking: "url('./assets/main/ranking.png')",
        lottery: "url('./assets/main/lottery.png')",
        giftBox: "url('./assets/lottery/giftBox.png')",
        veggieBox: "url('./assets/lottery/veggieBox.png')",
        board1: "url('./assets/market/board1.png')",
        board2: "url('./assets/market/board2.png')"
      },
      keyframes: {
        slideDown: {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        }
      },
      animation: {
        slideDown: 'slideDown 1s ease-out forwards'
      },
      boxShadow: {
        text: '-3px 0px 2px #FF7B7B, 0px 3px 2px #FF7B7B, 3px 0px 2px #FF7B7B, 0px -3px 2px #FF7B7B'
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow': {
          textShadow:
            '-3px 0px 2px #FF7B7B, 0px 3px 2px #FF7B7B, 3px 0px 2px #FF7B7B, 0px -3px 2px #FF7B7B'
        }
      });
    }
  ]
};
