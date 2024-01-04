import { useState, MouseEvent, useRef, useContext } from "react";
import { styled } from '@mui/system';
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import './LoginPage.css';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import axios from "axios";
import { UserInfoContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

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

type State = 'login' | 'register' | 'email_confirm';

type FormError = {
    login: Boolean;
    password: Boolean;
    loginDesc: string;
    passwordDesc: string;
}

type UserResponseType = {
    id: number;
    username: string;
    password: string;
}

export default function DesktopLoginPage() {

    const navigate = useNavigate();

    const {setUserInfo} = useContext(UserInfoContext);

    const passwordRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);

    const [curState, setCurState] = useState<State>('login');

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [formError, setFormError] = useState<FormError>({
        login: false,
        password: false,
        loginDesc: '',
        passwordDesc: ''
    })

    const [username, setUsername] = useState('');

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
                const data : UserResponseType = res.data;
                setUserInfo(
                    {
                        id: data.id,
                        name: data.username,
                    }
                );
                if(isMobile){
                    navigate('/friends');
                }
                else
                navigate(`/messenger/-1`);
                // localStorage.setItem('userInfo', JSON.stringify(data));
                localStorage.setItem('user_id', String(data.id));
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
        if(!passwordRef.current || !usernameRef.current || !emailRef.current) {
            return;
        }
        if(!baseCheckForm()) {
            return;
        }
        const url = `users/?username=${usernameRef.current.value}&password=${passwordRef.current.value}&email=${emailRef.current.value}`;
        axios.post(url)
        .then(
            res=>{ 
                setCurState('email_confirm');
                setUsername(usernameRef!.current!.value);
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

    const handleConfirmEmail = () => {
        if(!codeRef.current) {
            return;
        }
        if(codeRef.current.value.length !== 6) {
            return;
        }
        const url = `/confirm-email/${username}?code=${codeRef.current.value}`;
        axios.get(url)
        .then(
            res=>{
                setCurState('login');
            }
        )
        .catch(
            err=>{
                console.log(err);
            }
        )
    }

    const repeatCode = () => {
        const url = `/repeat-code/${username}`;
        axios.get(url)
        .then(
            res=>{
                // 
            }
        )
        .catch(
            err=>{
                console.log(err);
            }
        )
    }

    return (
        <section id="login">
            {
                curState === 'login' &&
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
                    style={
                        {
                            color: 'white'
                        }
                    }
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
                </> 
            }

            {
                curState === 'register' &&
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
                    label="Email"
                    inputRef={emailRef}
                    type="email"
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
                    style={
                        {
                            color: 'white'
                        }
                    }
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

            {
                curState === 'email_confirm' &&
                <>
                    <h2 className="ta-center">
                        На указанную почту выслан код подтверждения
                    </h2>
                    <p>
                        Проверьте "спам" и "рассылки"
                    </p>
                    <TextField
                    label="Код"
                    inputRef={codeRef}
                    color="secondary"
                    inputProps={
                        {
                            pattern: '^[0-9]{6}$'
                        }
                    }
                    />
                    <Btn
                    variant="contained"
                    onClick={handleConfirmEmail}
                    color="secondary"
                    style={
                        {
                            color: 'white'
                        }
                    }
                    >
                        Подтвердить код
                    </Btn>
                    <Btn
                    variant="contained"
                    onClick={repeatCode}
                    color="secondary"
                    style={
                        {
                            color: 'white'
                        }
                    }
                    >
                        Отправить ещё раз
                    </Btn>
                </>
            }
        </section>
    );
}
