import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import {Fill} from "../../../common/components/layout/Fill";
import Stack from "@mui/material/Stack";
import {FillAndCenter} from "../../../common/components/layout/FillAndCenter";
import React, {ReactNode, useMemo, useState} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileStepper from "@mui/material/MobileStepper";

type Props = {
  steps: Array<StepDefType>;
  completeComponent: ReactNode;
};

type StepDefType = {
  id: string;
  label: string;
  completed: boolean;
  render: (params: { onComplete: () => void }) => ReactNode;
};

export function OnboardingStepper({steps, completeComponent}: Props) {
  const theme = useTheme();
  const isTabletOrBigger = useMediaQuery(theme.breakpoints.up("md"));
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<{ id: string; index: number }>();

  const isStepCompleted = (stepDef: StepDefType) => completedSteps.includes(stepDef.id) || stepDef.completed

  const renderStep = (): ReactNode | null => {
    let counter = 0;
    for (const def of steps) {
      counter++;

      if (isStepCompleted(def)) {
        continue;
      }

      setActiveStep({id: def.id, index: counter});

      return def.render({
        onComplete: () => setCompletedSteps(completed => [def.id, ...completed]),
      });
    }

    return completeComponent;
  };

  return (
    <Fill component={Stack}>
      {isTabletOrBigger ? (
        <Stepper>
          {
            steps.map(step => (
              <Step key={step.id} completed={isStepCompleted(step)} active={activeStep?.id === step.id}>
                <StepLabel>
                  {step.label}
                </StepLabel>
              </Step>
            ))
          }
        </Stepper>
      ) : (
        <MobileStepper
          variant="dots"
          position="static"
          activeStep={activeStep?.index}
          steps={steps.length}
          backButton={null}
          nextButton={null}
          sx={{width: "100%"}}
        />
      )}

      <FillAndCenter>
        {
          useMemo(() => renderStep(), [steps, completedSteps])
        }
      </FillAndCenter>
    </Fill>
  );
}
