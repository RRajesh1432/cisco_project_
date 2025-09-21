import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-green-800 text-center mb-4">About AgriYield AI</h1>
                <p className="text-lg text-gray-600 text-center mb-8">
                    Empowering farmers with data-driven insights for a more productive and sustainable future.
                </p>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
                        <p className="text-gray-700">
                            AgriYield AI was built to bridge the gap between modern artificial intelligence and traditional farming. Our mission is to provide accessible, easy-to-use tools that help farmers and agricultural professionals make informed decisions. By predicting crop yields with high accuracy and offering actionable recommendations, we aim to enhance productivity, optimize resource usage, and promote sustainable farming practices worldwide.
                        </p>
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">How It Works</h2>
                        <p className="text-gray-700 mb-4">
                            This application leverages the power of Google's Gemini API, a state-of-the-art large language model. Here’s a simplified breakdown of the process:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li><strong>Data Input:</strong> You provide key details about your farm, including location, crop type, soil conditions, and climate data.</li>
                            <li><strong>AI Analysis:</strong> This information is sent to the Gemini model, which has been trained on vast amounts of agricultural and environmental data.</li>
                            <li><strong>Prediction & Recommendation:</strong> The model analyzes the inputs to forecast your potential crop yield. It goes a step further by identifying key risk factors and generating personalized, actionable recommendations to help you improve your harvest.</li>
                            <li><strong>Data Privacy:</strong> Your data is used solely for the purpose of generating your prediction. We value your privacy and do not store your farm data on our servers. The history feature saves data directly in your own browser.</li>
                        </ol>
                    </div>

                     <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Vision</h2>
                        <p className="text-gray-700">
                           We envision a world where every farmer, regardless of the size of their operation, has access to the tools and knowledge needed to thrive. As technology evolves, we are committed to continuously improving AgriYield AI, integrating new features, and supporting more crops to meet the growing demands of a changing world.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
