

import { FaShieldAlt, FaLock, FaEye, FaFileAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-blue-900 py-8 px-6 text-center">
                    <FaShieldAlt className="h-12 w-12 text-blue-300 mx-auto mb-4 text-5xl" />
                    <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                    <p className="mt-2 text-blue-200">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="p-8 space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                            <FaEye className="mr-2 text-blue-600" />
                            1. Information We Collect
                        </h2>
                        <p className="leading-relaxed">
                            We collect information you provide directly to us when you create an account, attend our services, make a donation, or communicate with us. This may include your name, email address, phone number, and address.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                            <FaLock className="mr-2 text-blue-600" />
                            2. How We Use Your Information
                        </h2>
                        <p className="leading-relaxed">
                            We use the information we collect to operate, maintain, and improve our services, to process donations, to communicate with you about events and services, and to provide you with customer support.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                            <FaFileAlt className="mr-2 text-blue-600" />
                            3. Sharing of Information
                        </h2>
                        <p className="leading-relaxed">
                            We do not share your personal information with third parties except as described in this privacy policy or with your consent. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
                        </p>
                    </section>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500 text-center">
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@faithassembly.org" className="text-blue-600 hover:text-blue-800">support@faithassembly.org</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
