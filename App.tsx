import React, { useState } from 'react';
import { EditorForm } from './components/EditorForm';
import { Preview } from './components/Preview';
import { PressReleaseData } from './types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('print-area');
    if (!element) return;

    setIsDownloading(true);

    try {
      // Capture the element
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true, // Handle cross-origin images if any
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Initialize PDF (A4 size, mm units)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210; // A4 width in mm
      
      // Calculate image height to maintain aspect ratio within PDF width
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      
      // Generate filename based on headline or date
      const filename = data.headline 
        ? `Pressemitteilung_${data.headline.substring(0, 20).replace(/[^a-z0-9]/gi, '_')}.pdf`
        : 'Pressemitteilung.pdf';
        
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Es gab einen Fehler beim Erstellen des PDFs.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row overflow-hidden">
      
      {/* Editor Column */}
      <div className="w-full lg:w-5/12 xl:w-4/12 h-auto lg:h-screen relative z-10 shadow-xl">
        <EditorForm 
          data={data} 
          onChange={setData} 
          onDownload={handleDownloadPDF}
          isDownloading={isDownloading}
        />
      </div>

      {/* Preview Column */}
      <div className="w-full lg:w-7/12 xl:w-8/12 h-auto lg:h-screen relative bg-gray-200/50">
        <Preview data={data} />
      </div>

    </div>
  );
};

export default App;