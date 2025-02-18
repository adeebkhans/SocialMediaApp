import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signinHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const googleLoginSuccess = async (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        // console.log('Decoded:', decoded);
    
        // Check if the user's email is verified
        if (decoded.email_verified) {
            // Generate a unique username (name + random 3-digit number)
            const username = `${decoded.name}${Math.floor(100 + Math.random() * 900)}`;
    
            try {
                const { email, sub: googleId } = decoded; // `sub` is the unique Google ID
    
                // Make the API call
                const res = await axios.post(
                    'http://localhost:8000/api/v1/user/google-login',
                    { email, username, googleId },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true, // Sends cookies for cross-origin requests
                    }
                );
    
                if (res.data.success) {
                    dispatch(setAuthUser(res.data.user));
                    navigate("/");
                    toast.success(res.data.message);
                    setInput({
                        email: "",
                        password: ""
                    });
                }
            } catch (error) {
                // Handle error and log details
                if (error.response) {
                    console.error('Server Error:', error.response.data);
                } else {
                    console.error('Error:', error.message);
                }
            }
        } else {
            console.log('Email not verified, cannot proceed with login.');
        }
    };
    

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signinHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <div className='flex justify-center'>
                        <img className='w-14 m-4' src='../../Logos/pngegg.png' />
                    </div>
                    {/* <h1 className='text-center font-bold text-xl'>LOGO</h1> */}
                    <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit'>Login</Button>
                    )
                }

                <span className='text-center'>Dosent have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
                <div className='flex justify-center'>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            googleLoginSuccess(credentialResponse)
                            // console.log(credentialResponse);
                            // const decoded = jwtDecode(credentialResponse.credential)
                            // console.log(decoded);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </div>
            </form>
        </div>
    )
}

export default Login
