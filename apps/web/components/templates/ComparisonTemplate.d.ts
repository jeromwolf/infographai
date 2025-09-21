import React from 'react';
interface ComparisonItem {
    label: string;
    value?: number;
    description?: string;
    color?: string;
}
interface ComparisonTemplateProps {
    title?: string;
    leftTitle?: string;
    rightTitle?: string;
    leftItems?: ComparisonItem[];
    rightItems?: ComparisonItem[];
    showVersus?: boolean;
    animate?: boolean;
}
export default function ComparisonTemplate({ title, leftTitle, rightTitle, leftItems, rightItems, showVersus, animate }: ComparisonTemplateProps): React.JSX.Element;
export {};
//# sourceMappingURL=ComparisonTemplate.d.ts.map