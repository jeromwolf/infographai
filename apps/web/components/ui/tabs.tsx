import React, { useState, createContext, useContext } from 'react';

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({ activeTab: '', setActiveTab: () => {} });

export const Tabs = ({
  children,
  defaultValue = '',
  className = ''
}: {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex space-x-2 border-b dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export const TabsTrigger = ({
  children,
  value,
  className = ''
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`px-4 py-2 font-medium transition-colors ${
        isActive
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
      } ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({
  children,
  value,
  className = ''
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return <div className={`mt-4 ${className}`}>{children}</div>;
};