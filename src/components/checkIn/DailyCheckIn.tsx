
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

type Question = {
  id: string;
  text: string;
  options: Array<{ value: string; label: string }>;
};

const DailyCheckIn: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  
  const questions: Question[] = [
    {
      id: 'pain',
      text: 'How would you rate your pain level today?',
      options: [
        { value: '0', label: 'No pain (0)' },
        { value: '1-3', label: 'Mild pain (1-3)' },
        { value: '4-6', label: 'Moderate pain (4-6)' },
        { value: '7-10', label: 'Severe pain (7-10)' },
      ],
    },
    {
      id: 'medication',
      text: 'Have you taken all your prescribed medications today?',
      options: [
        { value: 'yes', label: 'Yes, all of them' },
        { value: 'some', label: 'Some of them' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      id: 'symptoms',
      text: 'Are you experiencing any of these symptoms?',
      options: [
        { value: 'none', label: 'None of these' },
        { value: 'fever', label: 'Fever or chills' },
        { value: 'redness', label: 'Increased redness or swelling' },
        { value: 'discharge', label: 'Unusual discharge from wound' },
      ],
    },
    {
      id: 'mobility',
      text: 'How is your mobility today?',
      options: [
        { value: 'good', label: 'Moving around well' },
        { value: 'limited', label: 'Limited but managing' },
        { value: 'difficult', label: 'Having difficulty moving' },
        { value: 'unable', label: 'Unable to move without assistance' },
      ],
    },
    {
      id: 'mood',
      text: 'How would you describe your mood today?',
      options: [
        { value: 'good', label: 'Good' },
        { value: 'okay', label: 'Okay' },
        { value: 'down', label: 'Feeling down' },
        { value: 'anxious', label: 'Anxious or worried' },
      ],
    },
  ];
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (isComplete ? 1 : 0)) / questions.length) * 100;
  
  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
  };
  
  return (
    <div className="animate-fade-in">
      <Card className="max-w-2xl mx-auto border-none shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800">Daily Check-in</CardTitle>
              <CardDescription>
                Please answer these questions to help us monitor your recovery
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="pb-6">
          {!isComplete ? (
            <div className="space-y-6">
              <h3 className="font-medium text-lg text-gray-800">{currentQuestion.text}</h3>
              
              <RadioGroup 
                value={answers[currentQuestion.id] || ''} 
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQuestion.options.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-base cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800">Check-in Complete</h3>
                <p className="text-gray-600 mt-2 text-center">
                  Thank you for completing your daily check-in. Your care team will review your responses.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Today's Summary</h4>
                <div className="space-y-3">
                  {Object.entries(answers).map(([questionId, answer]) => {
                    const question = questions.find(q => q.id === questionId);
                    const option = question?.options.find(o => o.value === answer);
                    
                    return (
                      <div key={questionId}>
                        <p className="text-sm text-gray-600">{question?.text}</p>
                        <p className="text-sm font-medium text-gray-800">{option?.label}</p>
                        <Separator className="mt-2" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between gap-3">
          {!isComplete ? (
            <>
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="health-gradient"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </>
          ) : (
            <Button onClick={handleRestart} variant="outline" className="ml-auto">
              Start New Check-in
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DailyCheckIn;
