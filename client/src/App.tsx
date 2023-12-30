import './Main.css';
import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import DesktopLoginPage from './Desktop/pages/LoginPage';
import DesktopMessengerPage from './Desktop/pages/MessengerPage';
import { createContext, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';
import DefaultPage from './Desktop/pages/DefaultPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    secondary: {
      main: '#4CAF50'
    },
    warning: {
      main: '#8BC34A '
    }
  },
})

type UserInfoType = {
  id: number;
  name: string;
}

type UserInfoContextType = {
  userInfo: UserInfoType;
  setUserInfo: (user: UserInfoType) => void;
}

const UserInfoContext = createContext<UserInfoContextType>(
  {
    userInfo: {
      id: -1,
      name: ''
    },
    setUserInfo: (user: UserInfoType) => {}
  }
)

function App() {

  axios.defaults.baseURL = 'https://simple-messenger-server.onrender.com/';

  const [userInfo, setUserInfo] = useState<UserInfoType>({
    id: parseInt(localStorage.getItem('user_id') || '-1'),
    name: localStorage.getItem('user_name') || ''
  })

  return (
    <ThemeProvider theme={darkTheme}>
      <UserInfoContext.Provider value={{userInfo, setUserInfo}}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<DefaultPage/>} />
            <Route path='/messenger/:id' element={<DesktopMessengerPage/>} />
            <Route path='/login' element={<DesktopLoginPage/>} />
          </Routes>
        </BrowserRouter>
      </UserInfoContext.Provider>
    </ThemeProvider>
  );
}

export default App;

export {UserInfoContext};