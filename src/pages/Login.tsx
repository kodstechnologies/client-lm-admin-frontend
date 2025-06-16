import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import IconMail from '../components/Icon/IconMail';
import IconLockDots from '../components/Icon/IconLockDots';
import { setUser } from '../store/userConfigSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showMessage } from '../components/common/ShowMessage';
import Logo from '../assets/logo/logo.png';
import { emailVerify } from '../api/index'
import { log } from 'console';
interface FormValues {
    email: string;
    password: string;
}
const Login = () => {
    const [countdown, setCountdown] = useState(60);
    const [resendEnabled, setResendEnabled] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);



    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Admin Login'));
    }, [dispatch]);
    const navigate = useNavigate();

    const loginSchema = Yup.object().shape({
        email: Yup.string().required('Required'),
        password: Yup.string().required('Required'),
    });
    useEffect(() => {
        const timer = setTimeout(() => {
            setResendEnabled(true);
        }, 60000); // 1000ms = 1 second

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendEnabled(true);
        }
    }, [countdown]);
    const formik = useFormik<FormValues>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        enableReinitialize: true,

        onSubmit: async (values) => {
            setIsLoading(true); // Start loading
            try {
                const result = await emailVerify({
                    email: values.email,
                    password: values.password,
                });

                setOtpSent(true); // Disable button
                if (result && !result.error) {
                    dispatch(setUser({
                        userType: 'admin',
                        auth: true,
                        phoneNumber: result.phoneNumber,
                        phoneHint: result.phoneHint,
                        email: result.email,
                    }));

                    showMessage('OTP sent to registered mobile number');
                    navigate('/otp-verification', { state: { phoneNumber: result.phoneNumber, email: result.email } });
                } else {
                    showMessage(result.message || 'Authentication failed', 'error');
                }
            } catch (error) {
                showMessage('Unexpected error occurred', 'error');
                console.error("Login error:", error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        }

    });
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[600px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="w-36 ">

                                <img src={Logo} alt="" />
                            </div>
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={formik.handleSubmit}>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="Email" type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" {...formik.getFieldProps('email')} />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                    {formik.touched.email && formik.errors.email ? <div className="text-danger">{formik.errors.email}</div> : null}
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type="password"
                                            placeholder="Enter Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            {...formik.getFieldProps('password')}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                    {formik.touched.password && formik.errors.password ? <div className="text-danger">{formik.errors.password}</div> : null}
                                </div>
    <button
        type="submit"
        className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        disabled={otpSent || isLoading}
    >
        {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
            'Send OTP'
        )}
    </button>


                                {/* <button
                                    type="submit"
                                    className={`btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] ${!resendEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!resendEnabled}
                                >
                                    {resendEnabled ? 'Resend OTP' : `Resend OTP in ${countdown}s`}
                                </button> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
