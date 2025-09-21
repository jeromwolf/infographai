import React from 'react';
interface Step {
    id: string;
    title: string;
    description?: string;
    icon?: string;
}
interface StepFlowProps {
    steps: Step[];
    orientation?: 'horizontal' | 'vertical';
    stepColor?: string;
    lineColor?: string;
    activeColor?: string;
    animated?: boolean;
}
export declare const StepFlow: React.FC<StepFlowProps>;
export {};
//# sourceMappingURL=StepFlow.d.ts.map