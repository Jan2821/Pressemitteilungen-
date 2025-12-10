import React from 'react';
import { PressReleaseData } from '../types';

interface PreviewProps {
  data: PressReleaseData;
}

export const Preview: React.FC<PreviewProps> = ({ data }) => {
  // Use today's date if not provided
  const displayDate = data.date ? new Date(data.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="w-full h-full flex justify-center bg-gray-100 p-4 print:p-0 print:bg-white overflow-y-auto print:overflow-visible print:block">
      <div 
        className="bg-white shadow-lg print:shadow-none w-[210mm] min-h-[297mm] p-[20mm] box-border relative print:w-full print:max-w-none print:min-h-0 print:p-[20mm] print:mx-auto"
        id="print-area"
      >
        {/* Header Section */}
        <div className="border-b-4 border-black pb-6 mb-8">
          <h1 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Pressemitteilung</h1>
          <h2 className="text-3xl font-serif font-bold text-gray-900 leading-tight mb-2">
            {data.headline || "Hier steht Ihre Schlagzeile"}
          </h2>
          {data.subheadline && (
            <h3 className="text-xl font-serif text-gray-600 leading-normal">
              {data.subheadline}
            </h3>
          )}
        </div>

        {/* Dateline */}
        <div className="font-bold text-gray-700 mb-6 font-sans text-sm">
          <span className="uppercase">{data.city || "ORT"}</span>, <span className="">{displayDate}</span>
        </div>

        {/* Body Text */}
        <div className="prose max-w-none font-serif text-gray-800 leading-relaxed mb-10 whitespace-pre-wrap text-justify">
          {data.body || "Hier erscheint der Text Ihrer Pressemitteilung. Geben Sie links Ihre Inhalte ein oder nutzen Sie die KI-Funktionen, um einen Entwurf zu erstellen."}
        </div>

        {/* About Section (Boilerplate) */}
        {(data.aboutCompany) && (
          <div className="bg-gray-50 p-6 rounded-md mb-8 print:bg-transparent print:p-0 print:border-t print:border-gray-300 print:rounded-none print:mt-8">
            <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase">Über das Unternehmen</h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.aboutCompany}
            </p>
          </div>
        )}

        {/* Contact Footer */}
        <div className="mt-auto border-t border-gray-300 pt-6 avoid-break-inside">
          <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase">Pressekontakt</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold">{data.contactName || "Ansprechpartner"}</p>
              <p>{data.contactEmail || "email@beispiel.de"}</p>
            </div>
            <div className="text-right">
               <p>{data.contactPhone || "+49 123 456789"}</p>
               <p className="text-blue-600">{data.website || "www.beispiel.de"}</p>
            </div>
          </div>
        </div>
        
        {/* End Mark */}
        <div className="w-full text-center mt-8 text-gray-400 font-bold select-none">
          ###
        </div>
      </div>
    </div>
  );
};