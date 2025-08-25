import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        ad: "", soyad: "", email: "", password: "", telefon: ""
    });
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
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

    const handleRegister = () => {
        if (!form.ad || !form.soyad || !form.email || !form.password || !form.telefon) {
            setError("Lütfen tüm alanları doldurunuz");
            return;
        }
        if (!form.email.includes("@")) {
            setError("Lütfen geçerli bir email giriniz");
            return;
        }
        if (!checked1 || !checked2) {
            setError("Kayıt olmak için izin vermeniz gerekmektedir");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find(u => u.email === form.email);

        if (existingUser) {
            setError("Bu email ile zaten bir hesap bulunmaktadır");
            return;
        }

        users.push(form);
        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("loggedInUser", JSON.stringify(form));
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
                                className="hover:text-gray-600 transition-colors"
                            >
                                {t('login')}
                            </Link>
                            <Link
                                to={"/account/register"}
                                className='font-bold hover:text-gray-600 transition-colors'
                            >
                                {t('register1')}
                            </Link>
                        </div>

                        {/* Form */}
                        <div className="grid gap-4 mt-8 lg:mt-10">
                            <input
                                className="border-b border-gray-300 p-3 mb-4 text-base sm:text-[17px] w-full outline-none focus:border-gray-600 transition-colors bg-transparent"
                                type="text"
                                placeholder={t('name')}
                                value={form.ad}
                                onChange={(e) => setForm({ ...form, ad: e.target.value })}
                            />
                            <input
                                className="border-b border-gray-300 p-3 mb-5 text-base sm:text-[17px] w-full outline-none focus:border-gray-600 transition-colors bg-transparent"
                                type="text"
                                placeholder={t('surname')}
                                value={form.soyad}
                                onChange={(e) => setForm({ ...form, soyad: e.target.value })}
                            />
                            <input
                                className="border-b border-gray-300 p-3 mb-5 text-base sm:text-[17px] w-full outline-none focus:border-gray-600 transition-colors bg-transparent"
                                type="email"
                                placeholder={t('email')}
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            <input
                                className="border-b border-gray-300 p-3 mb-5 text-base sm:text-[17px] w-full outline-none focus:border-gray-600 transition-colors bg-transparent"
                                type="password"
                                placeholder={t('PW')}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            <input
                                className="border-b border-gray-300 p-3 mb-5 text-base sm:text-[17px] w-full outline-none focus:border-gray-600 transition-colors bg-transparent"
                                type="tel"
                                placeholder={t('phone')}
                                value={form.telefon}
                                onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                            />

                            {/* Checkboxes */}
                            <div className="flex items-start gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    className="mt-1 flex-shrink-0"
                                    onChange={(e) => setChecked1(e.target.checked)}
                                />
                                <span className="text-sm sm:text-[15px] leading-relaxed">
                                    {t('CBox1')}
                                </span>
                            </div>
                            <div className="flex items-start gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    className="mt-1 flex-shrink-0"
                                    onChange={(e) => setChecked2(e.target.checked)}
                                />
                                <span className="text-sm sm:text-[15px] leading-relaxed">
                                    {t('CBox2')}
                                </span>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 border border-red-200 rounded">
                                    {error}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                className='bg-black hover:bg-gray-800 transition-colors cursor-pointer p-3 w-full border text-white font-medium rounded-sm'
                                onClick={handleRegister}
                            >
                                {t('register2')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Image Container */}
                <div className="hidden lg:block lg:w-1/2">
                    <div className="h-full">
                        <img
                            src="https://cdn.myikas.com/images/theme-images/f6a0682d-3c94-496a-b7f1-df3dea380157/image_1080.webp"
                            alt="Register illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register;