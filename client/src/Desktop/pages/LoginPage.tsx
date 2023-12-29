import { useState, MouseEvent, useRef, useContext } from "react";
import { styled } from '@mui/system';
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import './LoginPage.css';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import axios from "axios";
import { UserInfoContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Btn = styled(Button)({
    textTransform: 'none',
})

const StyledA = styled('a')({
    '&:visited': {
        color: '#8BC34A '
    },
    color: '#8BC34A ',
    textDecoration: 'underline',
    cursor: 'pointer'
})

type State = 'login' | 'register';

type FormError = {
    login: Boolean;
    password: Boolean;
    loginDesc: string;
    passwordDesc: string;
}

export default function DesktopLoginPage() {

    const navigate = useNavigate();

    const {setUserInfo} = useContext(UserInfoContext);

    const passwordRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);

    const [curState, setCurState] = useState<State>('login');

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [formError, setFormError] = useState<FormError>({
        login: false,
        password: false,
        loginDesc: '',
        passwordDesc: ''
    })

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const baseCheckForm = () => {
        let curError : FormError = {
            login: false,
            password: false,
            loginDesc: '',
            passwordDesc: ''
        };
        const username = usernameRef.current!.value;
        const password = passwordRef.current!.value;
        if(username.length > 15){
            curError = {
                ...curError,
                login: true,
                loginDesc: 'Логин должен быть меньше 15 символов'
            }
        }
        if(username.length < 4){
            curError = {
                ...curError,
                login: true,
                loginDesc: 'Логин должен быть больше 4 символов'
            }
        }
        if(password.length < 4){
            curError = {
                ...curError,
                password: true,
                passwordDesc: 'Пароль должен быть больше 4 символов'
            }
        }
        if(password.length > 25){
            curError = {
                ...curError,
                password: true,
                passwordDesc: 'Пароль должен быть меньше 25 символов'
            }
        }
        setFormError(curError);
        if(curError.login || curError.password) {
            return false;
        }
        return true;
    }

    const handleLogin = () => {
        if(!passwordRef.current || !usernameRef.current) {
            return;
        }
        if(!baseCheckForm()) {
            return;
        }
        const url = `check-auth?username=${usernameRef.current.value}&password=${passwordRef.current.value}`;
        axios.get(url)
        .then(
            res=>{
                const data = res.data;
                setUserInfo(data);
                navigate(`/messenger/-1`);
                // localStorage.setItem('userInfo', JSON.stringify(data));
                localStorage.setItem('user_id', data.id);
                localStorage.setItem('username', data.username);
                localStorage.setItem('password', data.password);
            }
        )
        .catch(
            err=>{
                console.log(err);
                setFormError({
                    login: true,
                    password: true,
                    loginDesc: 'Неверные данные',
                    passwordDesc: 'Неверные данные'
                })
            }
        )
    }

    const handleRegister = () => {
        if(!passwordRef.current || !usernameRef.current) {
            return;
        }
        if(!baseCheckForm()) {
            return;
        }
        const url = `users/?username=${usernameRef.current.value}&password=${passwordRef.current.value}`;
        axios.post(url)
        .then(
            res=>{ 
                handleLogin();
            }
        )
        .catch(
            err=>{
                console.log(err);
                setFormError({
                    login: true,
                    password: false,
                    loginDesc: 'Логин уже занят',
                    passwordDesc: ''
                })
            }
        )
        
    }

    return (
        <section id="login">
            {
                curState === 'login' ? 
                <>
                    <h2 className="ta-center">
                        Вход
                    </h2>
                    <TextField
                    label="Логин"
                    error={formError.login.valueOf()}
                    helperText={formError.loginDesc}
                    inputRef={usernameRef}
                    color="secondary"
                    />
                    <TextField
                    label="Пароль"
                    error={formError.password.valueOf()}
                    helperText={formError.passwordDesc}
                    inputRef={passwordRef}
                    color="secondary"
                    InputProps={
                        {
                            type: showPassword ? 'text' : 'password',
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }
                    />
                    <Btn
                    variant="contained"
                    onClick={handleLogin}
                    color="secondary"
                    >
                        Войти
                    </Btn>
                    <p className="ta-center">
                        Ещё нет аккаунта?  &nbsp;
                        <StyledA
                        className="us-none"
                        onClick={() => setCurState('register')}
                        >
                            Зарегистрироваться
                        </StyledA>
                    </p>
                </> :
                <>
                    <h2 className="ta-center">
                        Регистрация
                    </h2>
                    <TextField
                    label="Логин"
                    error={formError.login.valueOf()}
                    helperText={formError.loginDesc}
                    inputRef={usernameRef}
                    color="secondary"
                    />
                    <TextField
                    label="Пароль"
                    error={formError.password.valueOf()}
                    helperText={formError.passwordDesc}
                    inputRef={passwordRef}
                    color="secondary"
                    InputProps={
                        {
                            type: showPassword ? 'text' : 'password',
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }
                    />
                    <Btn
                    variant="contained"
                    onClick={handleRegister}
                    color="secondary"
                    >
                        Зарегистрироваться
                    </Btn>
                    <p className="ta-center us-none">
                        Уже есть аккаунт?  &nbsp;
                        <StyledA
                        className="us-none"
                        onClick={() => setCurState('login')}
                        >
                            Войти
                        </StyledA>
                    </p>
                </>
            }
        </section>
    );
}
