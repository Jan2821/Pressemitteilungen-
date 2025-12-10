import React, { useState } from 'react';
import { PressReleaseData, GeneratorType } from '../types';
import { generatePRContent } from '../services/geminiService';
import { Wand2, Loader2, RefreshCw, Download } from 'lucide-react';

interface EditorFormProps {
  data: PressReleaseData;
  onChange: (data: PressReleaseData) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export const EditorForm: React.FC<EditorFormProps> = ({ data, onChange, onDownload, isDownloading }) => {
  const [loading, setLoading] = useState<GeneratorType | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [activeAiField, setActiveAiField] = useState<GeneratorType | null>(null);

  const handleChange = (field: keyof PressReleaseData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleAI = async (type: GeneratorType) => {
    if (!aiPrompt && type !== GeneratorType.IMPROVE) return;
    
    setLoading(type);
    try {
      let context = aiPrompt;
      let currentText = "";
      
      // If improving, use the current value of the field
      if (type === GeneratorType.IMPROVE) {
        currentText = data.body; 
        context = "improve"; // dummy context
      }

      const result = await generatePRContent(type, context, currentText);
      
      if (type === GeneratorType.HEADLINE) {
        // Try to pick the first one if multiple are returned, or let user edit
        const cleanHeadline = result.split('\n')[0].replace(/^["*-]\s*/, '').replace(/["*]$/, '');
        handleChange('headline', cleanHeadline);
      } else if (type === GeneratorType.BODY || type === GeneratorType.IMPROVE) {
        handleChange('body', result);
      } else if (type === GeneratorType.ABOUT) {
        handleChange('aboutCompany', result);
      }
      
      setActiveAiField(null);
      setAiPrompt("");
    } catch (error) {
      alert("Fehler bei der KI-Anfrage.");
    } finally {
      setLoading(null);
    }
  };

  const renderAIInput = (type: GeneratorType, placeholder: string) => {
    if (activeAiField !== type) {
      return (
        <button
          onClick={() => setActiveAiField(type)}
          className="text-xs flex items-center gap-1 text-purple-600 font-medium hover:text-purple-800 transition-colors mt-1"
        >
          <Wand2 size={14} /> KI-Assistent nutzen
        </button>
      );
    }

    return (
      <div className="mt-2 bg-purple-50 p-3 rounded-lg border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-200">
        <label className="block text-xs font-semibold text-purple-800 mb-1">
          KI-Instruktion:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 text-sm border border-purple-200 rounded px-2 py-1 focus:outline-none focus:border-purple-400"
            placeholder={placeholder}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAI(type)}
          />
          <button
            onClick={() => handleAI(type)}
            disabled={loading === type || !aiPrompt.trim()}
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading === type ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
            Generieren
          </button>
        </div>
        <button 
            onClick={() => setActiveAiField(null)}
            className="text-xs text-gray-400 hover:text-gray-600 mt-2 underline"
        >
            Abbrechen
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full overflow-y-auto flex flex-col">
      <div className="p-6 space-y-6 flex-1">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              📝 Editor
            </h2>
            <button 
              onClick={onDownload}
              disabled={isDownloading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2 font-medium"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Erstelle PDF...
                </>
              ) : (
                <>
                  <Download size={18} />
                  PDF herunterladen
                </>
              )}
            </button>
        </div>

        {/* Section: Header Info */}
        <div className="space-y-4 border-b border-gray-100 pb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kopfzeile</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Überschrift</label>
            <input
              type="text"
              value={data.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              placeholder="Schlagkräftige Überschrift..."
            />
            {renderAIInput(GeneratorType.HEADLINE, "Thema der Pressemitteilung...")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Untertitel (Optional)</label>
            <input
              type="text"
              value={data.subheadline}
              onChange={(e) => handleChange('subheadline', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              placeholder="Ergänzende Informationen..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
              <input
                type="text"
                value={data.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Berlin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
              <input
                type="date"
                value={data.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Section: Main Content */}
        <div className="space-y-4 border-b border-gray-100 pb-6">
          <div className="flex justify-between items-end">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Inhalt</h3>
             <button
                onClick={() => handleAI(GeneratorType.IMPROVE)}
                disabled={loading !== null || !data.body}
                className="text-xs text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {loading === GeneratorType.IMPROVE ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
               Text verbessern
             </button>
          </div>
          
          <div>
            <textarea
              value={data.body}
              onChange={(e) => handleChange('body', e.target.value)}
              rows={12}
              className="w-full border border-gray-300 rounded-md p-3 font-sans text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow resize-y"
              placeholder="Schreiben Sie hier Ihren Pressetext..."
            />
            {renderAIInput(GeneratorType.BODY, "Worum geht es in der Mitteilung?")}
          </div>
        </div>

        {/* Section: About & Contact */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Details & Kontakt</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Über das Unternehmen</label>
            <textarea
              value={data.aboutCompany}
              onChange={(e) => handleChange('aboutCompany', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="Kurzbeschreibung des Unternehmens..."
            />
            {renderAIInput(GeneratorType.ABOUT, "Name und Branche des Unternehmens...")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kontaktperson</label>
              <input
                type="text"
                value={data.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Max Mustermann"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
              <input
                type="email"
                value={data.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="presse@firma.de"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                type="tel"
                value={data.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="+49 ..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webseite</label>
              <input
                type="text"
                value={data.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="www.firma.de"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
        Powered by Gemini AI • PR-Genius
      </div>
    </div>
  );
};