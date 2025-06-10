import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Shield, 
  Calendar,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react';

interface FormData {
  passcode: string;
  hwid: string;
  expiration: string;
  description: string;
}

const steps = [
  { id: 1, name: 'Configuration', icon: Settings },
  { id: 2, name: 'Security', icon: Shield },
  { id: 3, name: 'Generate', icon: Download }
];

export const DLLGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    passcode: '',
    hwid: '',
    expiration: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (step === 1) {
      if (!formData.passcode) newErrors.passcode = 'Passcode is required';
      if (formData.passcode && formData.passcode.length < 8) {
        newErrors.passcode = 'Passcode must be at least 8 characters';
      }
    }
    
    if (step === 2) {
      if (!formData.hwid) newErrors.hwid = 'Hardware ID is required';
      if (!formData.expiration) newErrors.expiration = 'Expiration date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate DLL generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGeneratedFile(`Pro_EA_${Date.now()}.dll`);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    // Simulate file download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('DLL File Content'));
    element.setAttribute('download', generatedFile || 'expert_advisor.dll');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Passcode *
              </label>
              <input
                type="password"
                name="passcode"
                value={formData.passcode}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  errors.passcode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter a secure passcode"
              />
              {errors.passcode && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.passcode}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="Describe the purpose of this DLL"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hardware ID *
              </label>
              <input
                type="text"
                name="hwid"
                value={formData.hwid}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  errors.hwid ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter hardware ID"
              />
              {errors.hwid && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.hwid}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiration Date *
              </label>
              <input
                type="date"
                name="expiration"
                value={formData.expiration}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  errors.expiration ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiration && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.expiration}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            {!generatedFile ? (
              <>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Ready to Generate
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Passcode:</strong> {formData.passcode}</p>
                    <p><strong>Hardware ID:</strong> {formData.hwid}</p>
                    <p><strong>Expires:</strong> {formData.expiration}</p>
                    {formData.description && (
                      <p><strong>Description:</strong> {formData.description}</p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Generating DLL...
                    </>
                  ) : (
                    <>
                      <Settings className="h-5 w-5 mr-2" />
                      Generate DLL
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  DLL Generated Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your secure DLL file <strong>{generatedFile}</strong> has been generated.
                </p>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 inline-flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download DLL
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        {/* Stepper */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li key={step.id} className={`${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center h-10 w-10 rounded-full ${
                        currentStep >= step.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {step.name}
                      </div>
                    </div>
                    {stepIdx !== steps.length - 1 && (
                      <div className="flex-1 ml-4">
                        <div
                          className={`h-0.5 ${
                            currentStep > step.id
                              ? 'bg-blue-600'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        <div className="px-6 py-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {currentStep < 3 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};