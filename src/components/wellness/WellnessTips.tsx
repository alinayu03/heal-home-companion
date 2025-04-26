
import React from 'react';
import { Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TipCardProps {
  title: string;
  description: string;
  category: string;
  duration: string;
}

const TipCard: React.FC<TipCardProps> = ({ title, description, category, duration }) => {
  return (
    <Card className="health-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium bg-health-secondary/50 text-health-primary px-2 py-1 rounded-full">
            {category}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {duration}
          </div>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto text-health-primary hover:text-health-primary/80 hover:bg-health-secondary/20">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
};

const WellnessTips: React.FC = () => {
  const wellnessTips = {
    recovery: [
      {
        title: "Proper Wound Care",
        description: "Keep your surgical site clean and dry. Wash your hands thoroughly before changing dressings and follow your doctor's instructions for wound care.",
        category: "Wound Care",
        duration: "5 min read"
      },
      {
        title: "Pain Management Techniques",
        description: "Alternate between ice and heat therapy to reduce inflammation and pain. Remember to take your prescribed pain medication as directed.",
        category: "Pain Management",
        duration: "8 min read"
      },
      {
        title: "Gradual Return to Activity",
        description: "Start with gentle movements and gradually increase activity as approved by your healthcare provider. Listen to your body and rest when needed.",
        category: "Physical Activity",
        duration: "7 min read"
      },
    ],
    nutrition: [
      {
        title: "Protein-Rich Foods for Healing",
        description: "Include lean meats, eggs, dairy, beans, and nuts in your diet to provide the essential building blocks your body needs to repair tissue.",
        category: "Nutrition",
        duration: "6 min read"
      },
      {
        title: "Hydration for Recovery",
        description: "Drink plenty of water throughout the day. Staying hydrated helps with circulation, healing, and flushing out toxins from medications.",
        category: "Hydration",
        duration: "4 min read"
      },
      {
        title: "Anti-Inflammatory Foods",
        description: "Incorporate foods rich in omega-3 fatty acids, such as fatty fish, walnuts, and flaxseeds, to help reduce inflammation during recovery.",
        category: "Nutrition",
        duration: "9 min read"
      },
    ],
    mental: [
      {
        title: "Managing Recovery Anxiety",
        description: "Practice deep breathing exercises and mindfulness to manage anxiety related to your recovery process. Remember that healing takes time.",
        category: "Mental Health",
        duration: "10 min read"
      },
      {
        title: "Sleep Optimization",
        description: "Create a comfortable sleep environment and establish a regular sleep schedule to enhance your body's natural healing processes.",
        category: "Sleep",
        duration: "7 min read"
      },
      {
        title: "Staying Connected",
        description: "Maintain social connections during recovery. Reach out to friends and family or join support groups for those with similar experiences.",
        category: "Wellbeing",
        duration: "5 min read"
      },
    ],
  };
  
  return (
    <div className="animate-fade-in">
      <Card className="max-w-2xl mx-auto border-none shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center mb-1">
            <Heart className="text-health-accent mr-2 h-5 w-5" />
            <CardTitle className="text-2xl font-semibold text-gray-800">Wellness Tips</CardTitle>
          </div>
          <CardDescription>
            Personalized guidance to support your recovery journey
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4 pb-6">
          <Tabs defaultValue="recovery">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="mental">Mental Health</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recovery" className="space-y-4">
              {wellnessTips.recovery.map((tip, index) => (
                <TipCard
                  key={index}
                  title={tip.title}
                  description={tip.description}
                  category={tip.category}
                  duration={tip.duration}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="nutrition" className="space-y-4">
              {wellnessTips.nutrition.map((tip, index) => (
                <TipCard
                  key={index}
                  title={tip.title}
                  description={tip.description}
                  category={tip.category}
                  duration={tip.duration}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="mental" className="space-y-4">
              {wellnessTips.mental.map((tip, index) => (
                <TipCard
                  key={index}
                  title={tip.title}
                  description={tip.description}
                  category={tip.category}
                  duration={tip.duration}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellnessTips;
