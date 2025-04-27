import React, { useState, useEffect, useRef } from "react";
import {
  User,
  FileImage,
  Heart,
  Plus,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; //utility
import { motion, AnimatePresence } from "framer-motion";

// ===============================
//  ProfileSummary Component
// ===============================
interface ProfileSummaryProps {
  summaryText: string;
  patientName: string;
  patientType: string;
  labels: string[];
  scores: string[];
  result: string;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  summaryText,
  patientName,
  patientType,
  labels,
  scores,
  result,
}) => {
  return (
    <Card className="shadow-lg border border-gray-200 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 text-blue-700">
                {patientName}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {patientType}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="">
        {result && (
          <div className="mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              Overall Result:
            </h4>
            <p
              className={cn(
                "text-lg font-bold transition-colors text-center py-2 rounded-md shadow-md",
                result.includes("⚠️")
                  ? "text-red-500 bg-red-100/80 border border-red-500/30"
                  : "text-green-500 bg-green-100/80 border border-green-500/30"
              )}
            >
              {result}
            </p>
          </div>
        )}
        {labels && scores && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-indigo-600">
              Wellness Results:
            </h4>
            <div className="space-y-3">
              {/* Combine all scores into one for the bar */}
              {scores.length > 0 && (
                <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-md">
                  <span className="text-sm font-medium text-gray-800"></span>
                  <div className="flex-1 mx-2 h-4 bg-gray-200 rounded-full">
                    {/* Calculate average score for the bar */}
                    {(() => {
                      // Use the first score directly
                      const score = parseFloat(scores[0]);
                      const barColor =
                        score > 0.5 ? "bg-red-500" : "bg-green-500";
                      const displayScore = isNaN(score)
                        ? "N/A"
                        : `${score.toFixed(2)}`;
                      const widthPercentage = isNaN(score)
                        ? 0
                        : Math.min(score, 1) * 100; //convert to percentage
                      return (
                        <div
                          className={`${barColor} h-full rounded-full`}
                          style={{ width: `${widthPercentage}%` }}
                        ></div>
                      );
                    })()}
                  </div>
                  <span className="text-sm font-medium text-gray-800 min-w-[40px]">
                    {/* Display the first score */}
                    {scores[0] ? parseFloat(scores[0]).toFixed(2) : "N/A"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {summaryText}
        </p>
      </CardContent>
    </Card>
  );
};

const ProfileInfo: React.FC = () => {
  const [summaryText, setSummaryText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const patientName = "John Doe"; // Hardcoded patient name
  const patientType = "Patient"; // Hardcoded patient type.
  const [labels, setLabels] = useState<string[]>([]);
  const [scores, setScores] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Simulate fetching data from a file (in a real app, you'd use fetch or similar)
        const response = await fetch("/data/summary.txt");
        if (!response.ok) {
          throw new Error(`Failed to fetch summary: ${response.status}`);
        }
        const text = await response.text();
        setSummaryText(text);

        const analysisResponse = await fetch("/data/output.txt");
        if (!analysisResponse.ok) {
          throw new Error(
            `Failed to fetch analysis data: ${analysisResponse.status}`
          );
        }
        const analysisText = await analysisResponse.text();
        try {
          const analysisData = JSON.parse(analysisText);
          setLabels(analysisData.labels);
          setScores(analysisData.scores);
          setResult(analysisData.result);
        } catch (parseError) {
          console.error("Error parsing output.txt", parseError);
          setError("Failed to parse analysis data. Ensure it is valid JSON.");
          setLoading(false);
          return;
        }
      } catch (err: any) {
        setError(err.message || "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button
          onClick={() => window.location.reload()} // Simple retry mechanism
          className="absolute top-1 bottom-1 right-1 text-red-500 focus:outline-none focus:shadow-outline"
          aria-label="Retry"
        >
          <svg
            className="h-6 w-6 fill-current"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Retry</title>
            <path d="M8 5v2a4 4 0 0 0 4 4h5a2 2 0 0 1-2-2v-1c0-.55-.22-1.05-.59-1.41L10 2.59l-3.41 3A2 2 0 0 1 6 7V5a2 0 0 1 2-2zM6.59 15.59L10 17.41l3.41-3A2 2 0 0 1 14 13v2a2 0 0 1-2 2H7a4 4 0 0 0-4-4v-2c0-.55.22-1.05.59-1.41z" />
          </svg>
        </button>
      </div>
    );
  }

  // Animation variants for the main card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    hover: {
      scale: 1.01,
      boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
  };

  // Variants for the medical information items
  const medicalInfoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.1, // Staggered delay for each item
      },
    }),
  };

  return (
    <div className="animate-fade-in flex flex-col md:flex-row-reverse gap-8">
      <div className="w-full md:w-1/3">
        <ProfileSummary
          summaryText={summaryText}
          patientName={patientName}
          patientType={patientType}
          labels={labels}
          scores={scores}
          result={result}
        />
      </div>
      <div className="w-full md:w-2/3">
        <motion.div
          ref={cardRef}
          className="border-none bg-white/90 backdrop-blur-md rounded-xl"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Card className="border-none bg-transparent">
            <CardHeader>
              <div className="flex items-center space-x-6">
                <Avatar className="h-16 w-16 border-4 border-health-primary shadow-lg">
                  {/* Use AvatarImage to display the picture */}
                  <AvatarImage
                    src="https://source.unsplash.com/150x150/?peep"
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-health-secondary text-health-primary text-2xl font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    John Doe
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Patient ID: 12345678 • DOB: 04/15/1980
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center text-blue-700">
                  <FileImage className="mr-3 h-6 w-6 text-health-primary" />
                  Medical Information
                </h3>

                <div className="space-y-6">
                  <motion.div
                    variants={medicalInfoVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                  >
                    <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700">
                        Recent Procedures
                      </h4>
                      <p className="text-gray-800">
                        Appendectomy - 2 weeks ago
                      </p>
                    </div>
                  </motion.div>

                  <Separator className="bg-gray-200" />

                  <motion.div
                    variants={medicalInfoVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                  >
                    <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700">
                        Allergies
                      </h4>
                      <p className="text-gray-800">Penicillin, Shellfish</p>
                    </div>
                  </motion.div>

                  <Separator className="bg-gray-200" />

                  <motion.div
                    variants={medicalInfoVariants}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                  >
                    <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700">
                        Current Medications
                      </h4>
                      <ul className="list-disc list-inside text-gray-800">
                        <li>Amoxicillin 500mg - 3x daily</li>
                        <li>Ibuprofen 400mg - as needed for pain</li>
                        <li>Multivitamin - daily</li>
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center text-blue-700">
                  <Heart className="mr-3 h-6 w-6 text-health-primary" />
                  Care Team
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="bg-gray-50/50 p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02] border border-gray-100"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h4 className="font-medium text-gray-900">
                      Dr. Sarah Johnson
                    </h4>
                    <p className="text-sm text-gray-600">Primary Surgeon</p>
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      Contact
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gray-50/50 p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02] border border-gray-100"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h4 className="font-medium text-gray-900">
                      Dr. Robert Chen
                    </h4>
                    <p className="text-sm text-gray-600">
                      Primary Care Physician
                    </p>
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      Contact
                    </p>
                  </motion.div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6 text-blue-700">
                  Emergency Contacts
                </h3>

                <motion.div
                  className="bg-gray-50/50 p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02] border border-gray-100"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h4 className="font-medium text-gray-900">Mary Doe</h4>
                  <p className="text-sm text-gray-600">Spouse</p>
                  <p className="text-sm text-gray-800">555-123-4567</p>
                </motion.div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-100 text-gray-900 border-gray-200 transition-colors
                           shadow-md hover:shadow-lg hover:scale-[1.01] font-medium"
                whileHover={{
                  backgroundColor: "#f0f0f0",
                  scale: 1.01,
                  boxShadow: "0px 3px 7px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Plus className="mr-2 h-5 w-5" />
                Update Medical Information
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileInfo;
