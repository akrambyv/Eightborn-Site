import { useTranslation } from "react-i18next";

function Error() {

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

    function geri() {
        window.history.back()
    }

    return (
        <main className="fixed inset-0 flex items-center  h-screen p-16 dark:bg-gray-50 dark:text-gray-800">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">{t('Err1')}</p>
                    <div
                        onClick={() => geri()}
                        className="inline-block cursor-pointer mt-[30px] px-8 py-3 font-semibold rounded dark:bg-violet-600 dark:text-gray-50">{t('Err2')}</div>
                </div>
            </div>
        </main>
    )
}

export default Error