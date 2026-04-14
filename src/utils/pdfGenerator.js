// PDF receipt generator using jsPDF

import jsPDF from 'jspdf';

/**
 * Generate PDF receipt for a request
 * @param {object} requestData - Request data
 * @returns {void} - Downloads the PDF
 */
export const generateReceipt = (requestData) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 86, 224); // Primary color
  doc.text('LokSetu', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Connecting people and aware everywhere', 105, 28, { align: 'center' });
  
  // Divider line
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Receipt title
  doc.setFontSize(16);
  doc.text('Service Request Receipt', 105, 45, { align: 'center' });
  
  // Request details
  doc.setFontSize(12);
  let yPos = 60;
  
  const addField = (label, value) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPos);
    yPos += 10;
  };
  
  addField('Request ID', requestData.id || 'N/A');
  addField('Department', requestData.department || 'N/A');
  addField('Service Type', requestData.serviceType || 'N/A');
  addField('Status', requestData.status || 'N/A');
  addField('Date & Time', requestData.createdAt || new Date().toLocaleString());
  
  if (requestData.issueType) {
    addField('Issue Type', requestData.issueType);
  }
  
  if (requestData.description) {
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Description:', 20, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    
    // Wrap text for description
    const splitDescription = doc.splitTextToSize(requestData.description, 170);
    doc.text(splitDescription, 20, yPos);
    yPos += splitDescription.length * 6;
  }
  
  // Footer
  yPos += 15;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for using LokSetu services', 105, yPos, { align: 'center' });
  doc.text('Keep this receipt for your records', 105, yPos + 6, { align: 'center' });
  
  // Save the PDF
  const fileName = `LokSetu_Receipt_${requestData.id || Date.now()}.pdf`;
  doc.save(fileName);
};

/**
 * Generate PDF receipt and return as blob (for preview)
 * @param {object} requestData - Request data
 * @returns {Blob} - PDF blob
 */
export const generateReceiptBlob = (requestData) => {
  const doc = new jsPDF();
  
  // Same content generation as above
  doc.setFont('helvetica');
  doc.setFontSize(20);
  doc.setTextColor(0, 86, 224);
  doc.text('LokSetu', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Connecting people and aware everywhere', 105, 28, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  doc.setFontSize(16);
  doc.text('Service Request Receipt', 105, 45, { align: 'center' });
  
  doc.setFontSize(12);
  let yPos = 60;
  
  const addField = (label, value) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPos);
    yPos += 10;
  };
  
  addField('Request ID', requestData.id || 'N/A');
  addField('Department', requestData.department || 'N/A');
  addField('Service Type', requestData.serviceType || 'N/A');
  addField('Status', requestData.status || 'N/A');
  addField('Date & Time', requestData.createdAt || new Date().toLocaleString());
  
  if (requestData.issueType) {
    addField('Issue Type', requestData.issueType);
  }
  
  if (requestData.description) {
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Description:', 20, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    
    const splitDescription = doc.splitTextToSize(requestData.description, 170);
    doc.text(splitDescription, 20, yPos);
  }
  
  return doc.output('blob');
};
