import React from 'react';
interface Step {
    id: string;
    title: string;
    description?: string;
    icon?: 'start' | 'process' | 'decision' | 'data' | 'end';
    highlight?: boolean;
}
interface ProcessFlowTemplateProps {
    title?: string;
    steps?: Step[];
    orientation?: 'horizontal' | 'vertical';
    showProgress?: boolean;
    animationSpeed?: number;
}
export default function ProcessFlowTemplate({ title, steps, orientation, showProgress, animationSpeed }: ProcessFlowTemplateProps): React.JSX.Element;
export {};
//# sourceMappingURL=ProcessFlowTemplate.d.ts.map