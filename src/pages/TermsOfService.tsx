

import { FaFileAlt, FaCheckCircle, FaExclamationCircle, FaQuestionCircle } from 'react-icons/fa';

const TermsOfService = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-blue-900 py-8 px-6 text-center">
                    <FaFileAlt className="h-12 w-12 text-blue-300 mx-auto mb-4 text-5xl" />
                    <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                    <p className="mt-2 text-blue-200">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="p-8 space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                            <FaCheckCircle className="mr-2 text-blue-600" />
                            1. Acceptance of Terms
                        </h2>
                        <p className="leading-relaxed">
                            By accessing or using our website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                            <FaExclamationCircle className="mr-2 text-blue-600" />
                            2. Use License
                        </h2>
                        <p className="leading-relaxed">
                            Permission is granted to temporarily download one copy of the materials (information or software) on Faith Assembly's website for personal, non-commercial transitory viewing only.
                        </p>
                        <ul className="list-disc ml-8 mt-2 space-y-2">
                            <li>Modify or copy the materials;</li>
                            <li>Use the materials for any commercial purpose, or for any public display;</li>
                            <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                            <FaQuestionCircle className="mr-2 text-blue-600" />
                            3. Disclaimer
                        </h2>
                        <p className="leading-relaxed">
                            The materials on Faith Assembly's website are provided on an 'as is' basis. Faith Assembly makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500 text-center">
                            If you have any questions about these Terms, please contact us at <a href="mailto:support@faithassembly.org" className="text-blue-600 hover:text-blue-800">support@faithassembly.org</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
