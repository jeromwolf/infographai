import React from 'react';
interface NetworkTemplateProps {
    title?: string;
    nodes?: Array<{
        id: string;
        label: string;
        type?: 'server' | 'database' | 'client' | 'cloud';
    }>;
    connections?: Array<{
        from: string;
        to: string;
        label?: string;
    }>;
    theme?: 'dark' | 'light';
    animate?: boolean;
}
export default function NetworkTemplate({ title, nodes, connections, theme, animate }: NetworkTemplateProps): React.JSX.Element;
export {};
//# sourceMappingURL=NetworkTemplate.d.ts.map