import React from "react";
import { User, CarFront, Calculator, Heart, Minus } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface StepProgressProps {
  currentStep: 1 | 2 | 3;
  insuranceType?: 'motor' | 'life' | null;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, insuranceType }) => {
  // Determine step 2 details based on insurance type
  let step2Label = "Select Insurance";
  let Step2Icon = Minus;

  if (insuranceType === 'motor') {
    step2Label = "Car Info";
    Step2Icon = CarFront;
  } else if (insuranceType === 'life') {
    step2Label = "Life Info";
    Step2Icon = Heart;
  }

  const steps = [
    { id: 1, label: "Personal Info", icon: User },
    { id: 2, label: step2Label, icon: Step2Icon },
    { id: 3, label: "Calculation", icon: Calculator }
  ] as const;

  return (
    <div className="flex items-center justify-center gap-3 md:gap-6 mb-8">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center">
              <div
                className={twMerge(
                  "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors",
                  isCompleted && "border-[#FFC107] bg-[#FFF8E1] text-black",
                  isActive && "border-black text-black bg-[#FFC107]",
                  !isActive && !isCompleted && "border-[#FFE082] text-[#B0BEC5]"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p
                className={twMerge(
                  "mt-2 text-xs sm:text-sm font-semibold",
                  isActive ? "text-black" : "text-[#B0BEC5]"
                )}
              >
                {step.label}
              </p>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] max-w-[60px] md:max-w-[100px] bg-gradient-to-r from-[#FFE082] to-[#FFC107]" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;

