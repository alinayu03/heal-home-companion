
import React, { useState } from 'react';
import { Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const PhotoAnalysis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        simulateAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };
  
  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisComplete(true);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 600);
  };
  
  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisComplete(false);
    setAnalysisProgress(0);
  };
  
  return (
    <div className="animate-fade-in">
      <Card className="max-w-2xl mx-auto border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Symptom Analysis</CardTitle>
          <CardDescription>
            Upload a photo of your wound, rash, or other visible symptom for AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-6">
          {!selectedImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 w-full flex flex-col items-center justify-center">
              <div className="bg-health-secondary/30 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-health-primary" />
              </div>
              <p className="text-gray-600 text-center mb-4">
                Drag and drop an image here, or click to browse
              </p>
              <Button className="health-gradient" onClick={() => document.getElementById('photo-upload')?.click()}>
                <Camera className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          ) : (
            <div className="w-full">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedImage}
                  alt="Uploaded symptom"
                  className="w-full h-64 object-cover"
                />
              </div>
              
              {isAnalyzing && (
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Analyzing image...</span>
                    <span className="text-sm font-medium">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
              )}
              
              {analysisComplete && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">Analysis Results</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    This appears to be a post-surgical wound that is healing properly. 
                    No signs of infection detected. Continue to keep the area clean and follow your care plan.
                  </p>
                  <div className="bg-white p-3 rounded border border-blue-100">
                    <h5 className="text-sm font-medium text-gray-700">Recommendations:</h5>
                    <ul className="text-sm text-gray-600 list-disc list-inside mt-1 space-y-1">
                      <li>Continue to clean daily with mild soap and water</li>
                      <li>Apply any prescribed ointments as directed</li>
                      <li>Monitor for increased redness, swelling, or discharge</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          {selectedImage && (
            <>
              <Button variant="outline" onClick={resetAnalysis}>
                Upload Another Photo
              </Button>
              {analysisComplete && (
                <Button variant="default">
                  Share With Doctor
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PhotoAnalysis;
