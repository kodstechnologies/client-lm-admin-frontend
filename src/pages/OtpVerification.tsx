
import type React from "react"

import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { setPageTitle } from "../store/themeConfigSlice"
import { setUser } from "../store/userConfigSlice"
import { useFormik } from "formik"
import * as Yup from "yup"
import { showMessage } from "../components/common/ShowMessage"
import Logo from "../assets/logo/logo.png"
import { emailVerify, verifyOtp, resendOtp } from "../api"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom";




interface FormValues {
    contactNo: string
    otp0: string
    otp1: string
    otp2: string
    otp3: string
    otp4: string
    otp5: string
}

const OtpVerification = () => {

    const [resendEnabled, setResendEnabled] = useState(false);

    const location = useLocation();
    const { phoneNumber, email } = location.state || {};
    // console.log("🚀 ~ OtpVerification ~ phoneNumber:", phoneNumber)
    // console.log("🚀 ~ OtpVerification ~ email:", email)
    const [hide, setHide] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(60);
    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        dispatch(setPageTitle("Merchant Login"));
        // console.log("Current phoneNumber from location state:", phoneNumber);
    }, [dispatch, phoneNumber]);

    function hidefunction() {
        setHide(false);
    }

    const handleSendOtp = () => {
        setCountdown(30);
        showMessage("OTP sent");
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setResendEnabled(true);
        }, 60000); // 1000ms = 1 second

        return () => clearTimeout(timer);
    }, []);
    const handleResendOtp = async () => {
        try {
            const result = await resendOtp({ mobileNumber: phoneNumber });
            showMessage("Otp resent successfully");

            // Reset timer and disable the button again
            setCountdown(60);
            setResendEnabled(false);
        } catch (error) {
            console.error("Resend OTP error:", error);
            showMessage("Failed to resend OTP", "error");
        }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendEnabled(true);
        }
    }, [countdown]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        formik.handleChange(e);
        if (e.target.value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const key = `otp${index}` as keyof FormValues;
        if (e.key === "Backspace" && !formik.values[key] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const loginSchema = Yup.object().shape({
        otp0: Yup.string().required("Required").length(1),
        otp1: Yup.string().required("Required").length(1),
        otp2: Yup.string().required("Required").length(1),
        otp3: Yup.string().required("Required").length(1),
        otp4: Yup.string().required("Required").length(1),
        otp5: Yup.string().required("Required").length(1),
    });


    const formik = useFormik<FormValues>({
        initialValues: {
            contactNo: phoneNumber,
            otp0: "",
            otp1: "",
            otp2: "",
            otp3: "",
            otp4: "",
            otp5: "",
        },
        validationSchema: loginSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const otp = `${values.otp0}${values.otp1}${values.otp2}${values.otp3}${values.otp4}${values.otp5}`;

            if (!phoneNumber) {
                showMessage("Phone number is missing. Please go back to the login page.", "error");
                return;
            }

            try {
                const response = await verifyOtp({ mobileNumber: phoneNumber, otp });
                // console.log("API Response:", response);

                if (response.success) {
                    dispatch(
                        setUser({
                            userType: 'admin',
                            auth: true,
                        })
                    );

                    // showMessage("Logged in successfully");
                    // navigate("/merchant-admin/dashboard");
                    navigate("/");
                } else {
                    showMessage(response.message || "Invalid OTP", "error");
                }
            } catch (error) {
                console.error("Error verifying OTP:", error);
                showMessage("Server error occurred during OTP verification", "error");
            }
        },
    });
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img
                    src="/assets/images/auth/coming-soon-object1.png"
                    alt="object1"
                    className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
                />
                <img
                    src="/assets/images/auth/coming-soon-object2.png"
                    alt="object2"
                    className="absolute left-24 top-0 h-40 md:left-[30%]"
                />
                <img
                    src="/assets/images/auth/coming-soon-object3.png"
                    alt="object3"
                    className="absolute right-0 top-0 h-[300px]"
                />
                <img src="/assets/images/auth/polygon-object.svg" alt="polygon" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[600px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="w-36 h-36">
                                <img src={Logo || "/placeholder.svg"} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Login</h1>

                                <p className="text-base font-bold leading-normal text-white-dark">
                                    OTP has been sent to Phone Number ******{phoneNumber.slice(-4)}
                                </p>
                            </div>

                            <form className="space-y-5 dark:text-white" onSubmit={formik.handleSubmit}>
                                <>
                                    <div>
                                        <label htmlFor="otp">OTP</label>
                                        <div className="flex gap-1 justify-center">
                                            {[0, 1, 2, 3, 4, 5].map((index) => {
                                                const key = `otp${index}` as keyof FormValues
                                                return (
                                                    <input
                                                        key={index}
                                                        id={`otp${index}`}
                                                        name={`otp${index}`}
                                                        type="password"
                                                        ref={(el: HTMLInputElement | null) => {
                                                            if (el) {
                                                                inputRefs.current[index] = el
                                                            }
                                                        }}
                                                        value={formik.values[key]}
                                                        onChange={(e) => handleChange(e, index)}
                                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                                        maxLength={1}
                                                        className="border rounded p-2 text-center"
                                                        style={{ fontSize: "20px", width: "50px" }}
                                                    />
                                                )
                                            })}
                                        </div>
                                        {(formik.touched.otp0 || formik.touched.otp1 || formik.touched.otp2 || formik.touched.otp3) &&
                                            (formik.errors.otp0 || formik.errors.otp1 || formik.errors.otp2 || formik.errors.otp3) && (
                                                <div className="text-danger">
                                                    {
                                                        (formik.errors.otp0 ||
                                                            formik.errors.otp1 ||
                                                            formik.errors.otp2 ||
                                                            formik.errors.otp3) as string
                                                    }
                                                </div>
                                            )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                    >
                                        Verify OTP
                                    </button>
                                    <button
                                        type="submit"
                                        className={`btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] ${!resendEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={!resendEnabled}
                                        onClick={handleResendOtp}
                                    >
                                        {resendEnabled ? 'Resend OTP' : `Resend OTP in ${countdown}s`}
                                    </button>
                                </>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtpVerification
