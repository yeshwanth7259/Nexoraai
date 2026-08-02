"use client";

import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { ProfessionalTemplate, ModernTemplate, MinimalTemplate } from '../templates';
import { ResumeData } from '../types';
import { Download, Loader2 } from 'lucide-react';

interface Props {
  data: ResumeData;
  template: 'professional' | 'modern' | 'minimal';
}

const getTemplateComponent = (template: string, data: ResumeData) => {
  switch (template) {
    case 'modern':
      return <ModernTemplate data={data} />;
    case 'minimal':
      return <MinimalTemplate data={data} />;
    case 'professional':
    default:
      return <ProfessionalTemplate data={data} />;
  }
};

export default function ResumeViewer({ data, template }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full flex items-center justify-center text-slate-500">Loading viewer...</div>;
  }

  const DocumentComponent = getTemplateComponent(template, data);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center bg-[#12121A] p-4 rounded-xl border border-white/10">
        <div className="text-sm font-semibold text-white">Live PDF Preview</div>
        <PDFDownloadLink 
          document={DocumentComponent} 
          fileName={`${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          {({ loading }) => loading ? (
            <><Loader2 size={16} className="animate-spin" /> Generating PDF...</>
          ) : (
            <><Download size={16} /> Download PDF</>
          )}
        </PDFDownloadLink>
      </div>
      
      <div className="flex-1 rounded-xl overflow-hidden border border-white/10 bg-white min-h-[600px]">
        <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
          {DocumentComponent}
        </PDFViewer>
      </div>
    </div>
  );
}
