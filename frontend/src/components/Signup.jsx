import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, Navigate, redirect, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth)

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const SignupHandler = async (e) => {
        setLoading(true)
        e.preventDefault();
        console.log(input);
        try {
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true // Allows sending cookies/credentials
            });

            if (res.data.success) { // means that success true return hua res.data.success==true then
                toast.success(res.data.message);
                navigate("/login")
                setInput({
                    username: "",
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={SignupHandler} className='shadow-lg flex flex-col gap-5 p-8 bg-white'>
                <div className='flex flex-col justify-center items-center'>
                    <img className='w-14 m-4' src='../../Logos/pngegg.png' />
                    {/* <h1 className='text-center font-bold text-xl'>LOGO</h1> */}
                    <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
                </div>
                <div>
                    <span className='font-medium'>Username</span>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 border border-gray-300 p-2 rounded"
                    />
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="text"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 border border-gray-300 p-2 rounded"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 border border-gray-300 p-2 rounded"
                    />
                </div>
                {loading ? (
                    <Button>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please wait
                    </Button>
                ) : (
                    <Button type='submit'>SignUp</Button>
                )}
                <span className='text-center'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
            </form>
        </div>
    );
};

export default Signup;
