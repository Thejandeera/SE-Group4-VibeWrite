import React, { useState, useRef } from 'react';
import { Download, FileText, Image, FileCode, Save, Loader2, Sparkles } from 'lucide-react';

const Document = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState(null);
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const contentRef = useRef(null);
  const editorStateRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Function to generate content with AI
  const generateContentWithAI = async () => {
    if (!title.trim()) {
      alert('Please enter a document title first');
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `You are an expert content writer. Based on the following document title,
       create comprehensive, well-structured content. 

Document Title: "${title}"

Create detailed, professional content for this document. Include:
- An engaging introduction
- Well-organized sections with subheadings (use HTML heading tags)
- Detailed paragraphs with valuable information
- Use proper HTML formatting (paragraphs, headings, lists, etc.)
- Make it informative and engaging

Respond with ONLY the HTML content (body content only, no <html>, <head>, 
or <body> tags). Use semantic HTML tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, etc.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith("```html")) {
        cleanedResponse = cleanedResponse.replace(/```html\n?/g, "").replace(/```\n?/g, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
      }

      setGeneratedContent(cleanedResponse);
      setEditorContent(cleanedResponse);
      alert('Content generated successfully! It has been loaded into the editor.');
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to handle editor state changes
  const handleEditorStateChange = (state) => {
    editorStateRef.current = state;
  };

  // Function to save draft
  const saveDraft = async () => {
    setIsSaving(true);
    try {
      // Get userId from session storage
      const userDataString = sessionStorage.getItem('userData');
      if (!userDataString) {
        alert('Please login to save drafts');
        return;
      }

      const userData = JSON.parse(userDataString);
      const userId = userData.id;

      if (!userId) {
        alert('User ID not found. Please login again.');
        return;
      }

      // Get editor content (plain text only)
      const editorContentEl = contentRef.current?.querySelector('.editor-input');
      if (!editorContentEl || !editorContentEl.textContent.trim()) {
        alert('Cannot save empty content');
        return;
      }

      const content = editorContentEl.textContent.trim();

      // Send POST request
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/drafts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          userId: userId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Save draft error:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Sanitize filename
  const sanitizeFilename = (name) => {
    if (!name || name.trim() === '') return 'untitled';
    return name.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
  };

  // Function to export as PDF
  const exportAsPDF = async () => {
    setIsExporting(true);
    setExportType('pdf');
    
    try {
      const editorContentEl = contentRef.current?.querySelector('.editor-input');
      if (!editorContentEl) {
        alert('No content to export');
        return;
      }

      const printWindow = window.open('', '_blank');
      const contentHTML = editorContentEl.innerHTML;
      const documentTitle = title.trim() || 'Untitled Document';
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              @page {
                margin: 1in;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                line-height: 1.6;
                color: #1f2937;
                max-width: 8.5in;
                margin: 0 auto;
                padding: 20px;
              }
              .document-title {
                font-size: 2.5em;
                font-weight: 700;
                margin-bottom: 0.5em;
                color: #111827;
                border-bottom: 3px solid #3b82f6;
                padding-bottom: 0.3em;
              }
              h1 { font-size: 2em; margin-bottom: 0.5em; margin-top: 1em; }
              h2 { font-size: 1.5em; margin-bottom: 0.5em; margin-top: 0.8em; }
              h3 { font-size: 1.17em; margin-bottom: 0.5em; margin-top: 0.6em; }
              p { margin-bottom: 1em; }
              ul, ol { margin-bottom: 1em; padding-left: 2em; }
              li { margin-bottom: 0.5em; }
              code {
                background-color: #f3f4f6;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
              }
              pre {
                background-color: #f3f4f6;
                padding: 12px;
                border-radius: 6px;
                overflow-x: auto;
                border: 1px solid #e5e7eb;
              }
              blockquote {
                border-left: 4px solid #3b82f6;
                padding-left: 16px;
                margin-left: 0;
                color: #4b5563;
                font-style: italic;
              }
              a {
                color: #2563eb;
                text-decoration: underline;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 1em;
              }
              th, td {
                border: 1px solid #e5e7eb;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f3f4f6;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <h1 class="document-title">${documentTitle}</h1>
            ${contentHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export as PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // Function to export as PNG
  const exportAsPNG = async () => {
    setIsExporting(true);
    setExportType('png');
    
    try {
      const html2canvas = (await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm')).default;
      
      const editorContentEl = contentRef.current?.querySelector('.editor-input');
      if (!editorContentEl) {
        alert('No content to export');
        return;
      }

      const documentTitle = title.trim() || 'Untitled Document';
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        background: white;
        padding: 60px;
        width: 900px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        line-height: 1.6;
        color: #1f2937;
      `;
      
      const titleHtml = `
        <h1 style="font-size: 2.5em; font-weight: 700; margin-bottom: 0.5em; color: #111827; border-bottom: 3px solid #3b82f6; padding-bottom: 0.3em;">
          ${documentTitle}
        </h1>
      `;
      
      tempContainer.innerHTML = titleHtml + editorContentEl.innerHTML;
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      document.body.removeChild(tempContainer);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sanitizeFilename(title)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');

    } catch (error) {
      console.error('PNG export error:', error);
      alert('Failed to export as PNG. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // Function to export as HTML
  const exportAsHTML = async () => {
    setIsExporting(true);
    setExportType('html');
    
    try {
      const editorContentEl = contentRef.current?.querySelector('.editor-input');
      if (!editorContentEl) {
        alert('No content to export');
        return;
      }

      const documentTitle = title.trim() || 'Untitled Document';
      const contentHTML = editorContentEl.innerHTML;
      
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentTitle}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: #ffffff;
        }
        .document-title {
            font-size: 2.5em;
            font-weight: 700;
            margin-bottom: 0.5em;
            color: #111827;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 0.3em;
        }
        h1 { font-size: 2em; margin: 1em 0 0.5em; }
        h2 { font-size: 1.5em; margin: 0.8em 0 0.5em; }
        h3 { font-size: 1.17em; margin: 0.6em 0 0.5em; }
        p { margin-bottom: 1em; }
        ul, ol { margin-bottom: 1em; padding-left: 2em; }
        li { margin-bottom: 0.5em; }
        code {
            background-color: #f3f4f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #f3f4f6;
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            border: 1px solid #e5e7eb;
        }
        blockquote {
            border-left: 4px solid #3b82f6;
            padding-left: 16px;
            margin-left: 0;
            color: #4b5563;
            font-style: italic;
        }
        a {
            color: #2563eb;
            text-decoration: underline;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 1em;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <h1 class="document-title">${documentTitle}</h1>
    ${contentHTML}
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sanitizeFilename(title)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('HTML export error:', error);
      alert('Failed to export as HTML. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // Function to export as Markdown
  const exportAsMarkdown = async () => {
    setIsExporting(true);
    setExportType('md');
    
    try {
      const editorContentEl = contentRef.current?.querySelector('.editor-input');
      if (!editorContentEl) {
        alert('No content to export');
        return;
      }

      const documentTitle = title.trim() || 'Untitled Document';
      
      let markdown = `# ${documentTitle}\n\n`;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorContentEl.innerHTML;
      
      const convertNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent;
        }
        
        const tag = node.tagName?.toLowerCase();
        let result = '';
        
        switch (tag) {
          case 'h1':
            result = `\n# ${node.textContent}\n\n`;
            break;
          case 'h2':
            result = `\n## ${node.textContent}\n\n`;
            break;
          case 'h3':
            result = `\n### ${node.textContent}\n\n`;
            break;
          case 'p':
            result = `${node.textContent}\n\n`;
            break;
          case 'strong':
          case 'b':
            result = `**${node.textContent}**`;
            break;
          case 'em':
          case 'i':
            result = `*${node.textContent}*`;
            break;
          case 'code':
            result = `\`${node.textContent}\``;
            break;
          case 'pre':
            result = `\n\`\`\`\n${node.textContent}\n\`\`\`\n\n`;
            break;
          case 'blockquote':
            result = `\n> ${node.textContent}\n\n`;
            break;
          case 'a':
            result = `[${node.textContent}](${node.href || '#'})`;
            break;
          case 'ul':
          case 'ol':
            Array.from(node.children).forEach((li, i) => {
              const prefix = tag === 'ol' ? `${i + 1}. ` : '- ';
              result += `${prefix}${li.textContent}\n`;
            });
            result += '\n';
            break;
          default:
            Array.from(node.childNodes).forEach(child => {
              result += convertNode(child);
            });
        }
        
        return result;
      };
      
      Array.from(tempDiv.childNodes).forEach(child => {
        markdown += convertNode(child);
      });

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sanitizeFilename(title)}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Markdown export error:', error);
      alert('Failed to export as Markdown. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // Function to export as TXT
  const exportAsTXT = async () => {
    setIsExporting(true);
    setExportType('txt');
    
    try {
      const editorContentEl = contentRef.current?.querySelector('.editor-input');
      if (!editorContentEl) {
        alert('No content to export');
        return;
      }

      const documentTitle = title.trim() || 'Untitled Document';
      const textContent = `${documentTitle}\n${'='.repeat(documentTitle.length)}\n\n${editorContentEl.textContent}`;

      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sanitizeFilename(title)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('TXT export error:', error);
      alert('Failed to export as TXT. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="p-8 w-full">
          <div className="max-w-5xl mx-auto">
            {/* Title Input Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title..."
                  className="flex-1 text-4xl font-bold border-none outline-none focus:ring-0 placeholder-gray-300 text-gray-900 bg-transparent px-0"
                />
                <button
                  onClick={generateContentWithAI}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Generate Content</span>
                    </>
                  )}
                </button>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mt-3 rounded-full" />
            </div>

            {/* Action Buttons Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700 mr-2">Export as:</span>
                
                <button
                  onClick={exportAsPDF}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                >
                  {isExporting && exportType === 'pdf' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  <span>PDF</span>
                </button>
                
                <button
                  onClick={exportAsPNG}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                >
                  {isExporting && exportType === 'png' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Image className="h-4 w-4" />
                  )}
                  <span>PNG</span>
                </button>

                <button
                  onClick={exportAsHTML}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                >
                  {isExporting && exportType === 'html' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileCode className="h-4 w-4" />
                  )}
                  <span>HTML</span>
                </button>

                <button
                  onClick={exportAsMarkdown}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                >
                  {isExporting && exportType === 'md' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>Markdown</span>
                </button>

                <button
                  onClick={exportAsTXT}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                >
                  {isExporting && exportType === 'txt' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  <span>TXT</span>
                </button>
              </div>

              {/* Save Draft Button */}
              <button
                onClick={saveDraft}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Draft</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="p-8 w-full">
        <div className="max-w-5xl mx-auto">
          <div ref={contentRef} className="bg-white">
            <div className="w-full">
              {/* Simple Rich Text Editor */}
              <div className="editor-container border border-gray-300 rounded-lg">
                <div
                  contentEditable
                  className="editor-input min-h-[500px] p-6 outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: editorContent }}
                  onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: '#1f2937'
                  }}
                />
              </div>
              
              <div className="mt-2 text-xs text-gray-500">Start writing or generate content with AI using the title above.</div>
              
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium">Character count:</span> {contentRef.current?.querySelector('.editor-input')?.textContent?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Document;