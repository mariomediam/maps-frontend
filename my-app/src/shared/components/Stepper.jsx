import { useState } from "react";

const Stepper = ({ 
  steps, 
  onComplete, 
  onStepChange,
  className = "",
  showStepLabels = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (onStepChange) {
        onStepChange(newStep, steps[newStep]);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      if (onStepChange) {
        onStepChange(newStep, steps[newStep]);
      }
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const getStepClasses = (stepIndex) => {
    if (stepIndex < currentStep) {
      // Paso completado
      return {
        li: "flex w-full items-center text-primary after:content-[''] after:w-full after:h-1 after:border-b after:border-primary after:border-4 after:inline-block",
        span: "flex items-center justify-center w-10 h-10 bg-primary rounded-full lg:h-12 lg:w-12 shrink-0",
        icon: "w-3.5 h-3.5 text-secondary lg:w-4 lg:h-4"
      };
    } else if (stepIndex === currentStep) {
      // Paso actual
      return {
        li: "flex w-full items-center text-blue-600 after:content-[''] after:w-full after:h-1 after:border-b after:border-primary after:border-4 after:inline-block",
        span: "flex items-center justify-center w-10 h-10 bg-primary rounded-full lg:h-12 lg:w-12 shrink-0",
        icon: "w-4 h-4 text-secondary lg:w-5 lg:h-5"
      };
    } else {
      // Paso pendiente
      return {
        li: "flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block",
        span: "flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 shrink-0",
        icon: "w-4 h-4 text-gray-500 lg:w-5 lg:h-5"
      };
    }
  };

  const renderStepIcon = (step, stepIndex) => {
    const classes = getStepClasses(stepIndex);
    
    if (stepIndex < currentStep) {
      // Mostrar check para pasos completados
      return (
        <svg className={classes.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
        </svg>
      );
    } else {
      // Mostrar el icono del paso
      return step.icon ? (
        <div className={classes.icon}>
          {step.icon}
        </div>
      ) : (
        <span className="text-sm font-medium text-current">
          {stepIndex + 1}
        </span>
      );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Stepper visual */}
      <div className="mb-8">
        <ol className="flex items-center w-full">
          {steps.map((step, index) => {
            const classes = getStepClasses(index);
            const isLast = index === steps.length - 1;
            
            return (
              <li 
                key={index} 
                className={isLast ? "flex items-center" : classes.li}
              >
                <span className={classes.span}>
                  {renderStepIcon(step, index)}
                </span>
                {showStepLabels && (
                  <div className="hidden sm:block ml-3">
                    <h3 className="font-medium text-gray-900">
                      {step.label}
                    </h3>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        
        {/* Etiquetas de pasos en móvil */}
        {/* {showStepLabels && (
          <div className="mt-4 text-center sm:hidden">
            <p className="text-sm text-gray-600">
              Paso {currentStep + 1} de {steps.length}: {steps[currentStep].label}
            </p>
          </div>
        )} */}
      </div>

      {/* Contenido del paso actual */}
      <div className="mb-8">
        {steps[currentStep].component}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            currentStep === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200"
          }`}
        >
          Anterior
        </button>

        <div className="flex space-x-2">
          {/* Indicador de progreso */}
          <span className="text-sm text-gray-500 self-center">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleComplete}
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-colors duration-200"
          >
            Grabar
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-opacity-90 focus:ring-4 focus:ring-blue-200 transition-colors duration-200"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
};

export default Stepper;
