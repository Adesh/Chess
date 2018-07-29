module.exports = {
  APP_VERSION: '1.0.0',
  DEEP_LINK_PROTOCOL: 'chessrt://',
  BASE_URL: 'https://www.Euristico.com/Chess',
  BASE_URL_API: 'https://chess-cool.herokuapp.com/api',
  ABOUT_US_URL: this.BASE_URL+'AboutUs',  
  PRIVACY_POLICY_URL: this.BASE_URL+'privacypolicy',
  COOKIE_POLICY_URL: this.BASE_URL+'cookiepolicy',
  TERMS_OF_USE_URL: this.BASE_URL+'termsofuse',
  
  APP_SETTING:{
    DEFAULT: {
      difficulty: '8', // Beginer:5, Pro:8, GrandMaster: 10
  		sound: true,
  		vibration: true,
      showCellId: true,
      showLastMove: false
    },
  },

  COLOR:{
    BACKGROUND    :'#FFFFFF',
    PRIMARY_DARK  :'#1976D2',
    PRIMARY       :'#2196F3',
    PRIMARY_LIGHT :'#BBDEFB',
    TEXT_ICON     :'#FFFFFF',
    ACCENT_COLOR  :'#8BC34A',
    PRIMARY_TEXT  :'#212121',
    SECONDARY_TEXT:'#727272',
  	DEVIDER       :'#B6B6B6',

    CELL_LIGHT:'white',
    CELL_DARK:'lightgrey',
    THEME:{
      swan:{
        darkPrimary: '#2196F3',
        defaultPrimary: '#FFFFFF',
        lightPrimary: '#FFFFFF',
        textPrimary: '#f2f2f2',
        primaryText: '#212121',
        secondaryText: '#757575',
        divider:'#BDBDBD',
      },
    },
  },

  FONT:{
    HEADER:45,
    SUB_HEADER:20,
    FONT_H1:16,
    FONT_H2:15,
    FONT_H3:14,
    FONT_H4:11,
    FONT_H5:10,
  },
  
  BACK_EXIT_TIMESTAMP:'',

};