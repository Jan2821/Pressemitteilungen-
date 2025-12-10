import React, { useState } from 'react';
import { EditorForm } from './components/EditorForm';
import { Preview } from './components/Preview';
import { PressReleaseData } from './types';

// Initial state
const initialData: PressReleaseData = {
  headline: "",
  subheadline: "",
  city: "",
  date: new Date().toISOString().split('T')[0],
  body: "",
  aboutCompany: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  website: ""
};

const App: React.FC = () => {
  const [data, setData] = useState<PressReleaseData>(initialData);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row overflow-hidden">
      
      {/* Editor Column - Hidden when printing */}
      <div className="w-full lg:w-5/12 xl:w-4/12 h-auto lg:h-screen print:hidden relative z-10 shadow-xl">
        <EditorForm 
          data={data} 
          onChange={setData} 
          onPrint={handlePrint}
        />
      </div>

      {/* Preview Column - Full screen when printing */}
      <div className="w-full lg:w-7/12 xl:w-8/12 h-auto lg:h-screen relative bg-gray-200/50 print:bg-white print:w-full print:h-full print:absolute print:top-0 print:left-0 print:z-50 print:m-0">
        <Preview data={data} />
      </div>

      {/* Mobile overlay prompt if needed, usually just stack */}
    </div>
  );
};

export default App;