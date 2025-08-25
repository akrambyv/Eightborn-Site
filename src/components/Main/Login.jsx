import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { t, i18n } = useTranslation() // i18n hook

    const getCurrentLanguageLabel = () => {
        const langMap = {
            'tr': 'TR',
            'en': 'EN',
            'az': 'AZ',
            'ru': 'RU'
        };
        return langMap[i18n.language] || 'TR';
    };

    const handleLogin = () => {
        if (!email.includes("@")) {
            setError("Lütfen geçerli bir email giriniz");
            return;
        }
        if (!password) {
            setError("Lütfen bu alanı (şifre) doldurunuz");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find(u => u.email === email && u.password === password);

        if (!existingUser) {
            setError("Müşteri hesabı bulunamadı");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(existingUser));
        localStorage.setItem("token", "logged_in_token");

        setError("");

        navigate("/");
        window.location.reload();
    };

    return (
        <main>
            <div className="flex flex-col lg:flex-row lg:justify-between h-full">
                <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 xl:px-16 flex items-start justify-center pt-8 lg:pt-20">
                    <div className="w-full max-w-md mx-auto pb-8 lg:pb-0">
                        <div className='flex gap-4 sm:gap-6 text-xl sm:text-2xl justify-center lg:justify-start'>
                            <Link
                                to={"/account/login"}
                                className='font-bold hover:text-gray-600 transition-colors'
                            >
                                {t('login')}
                            </Link>
                            <Link
                                to={"/account/register"}
                                className="hover:text-gray-600 transition-colors"
                            >
                                {t('register1')}
                            </Link>
                        </div>

                        {/* Form */}
                        <div className="grid gap-4 mt-8 lg:mt-10">
                            <input
                                className="border-b border-gray-300 p-3 mb-4 text-base sm:text-[17px] w-full outline-none focus:border-gray-600 transition-colors bg-transparent"
                                type="email"
                                placeholder={t('email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className="border-b border-gray-300 p-3 mb-5 text-base sm:text-[17px] w-full outline-none focus:border-gray-600 transition-colors bg-transparent"
                                type="password"
                                placeholder={t('PW')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 border border-red-200 rounded">
                                    {error}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                className='bg-black hover:bg-gray-800 transition-colors cursor-pointer p-3 w-full border text-white font-medium rounded-sm'
                                onClick={handleLogin}
                            >
                                {t('login')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Image Container */}
                <div className="hidden lg:block lg:w-1/2">
                    <div className="h-full">
                        <img
                            src="https://cdn.myikas.com/images/theme-images/c160a98c-1954-467a-9ed2-6691463034c1/image_1080.webp"
                            alt="Login illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login;