const fs = require('fs');
let code = fs.readFileSync('app/(main)/assistant/page.tsx', 'utf-8');

const imports = `import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
`;

code = code.replace(
  'import { parseFileToText } from "@/utils/file-parser";',
  'import { parseFileToText } from "@/utils/file-parser";\n' + imports
);

const componentsReplacement = `                        components={{
                          code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\\w+)/.exec(className || '');
                            return !inline && match ? (
                              <div className="rounded-lg overflow-hidden my-4 border border-white/10 shadow-lg">
                                <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-slate-400 border-b border-white/5 flex items-center justify-between">
                                  <span>{match[1]}</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(String(children).replace(/\\n$/, ''))}
                                    className="hover:text-white transition-colors flex items-center gap-1.5"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    Copy
                                  </button>
                                </div>
                                <SyntaxHighlighter
                                  {...props}
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{ margin: 0, background: '#1e1e1e', padding: '1rem', fontSize: '0.85rem' }}
                                >
                                  {String(children).replace(/\\n$/, '')}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code {...props} className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-pink-300 font-mono">
                                {children}
                              </code>
                            )
                          },
                          p: ({children}) => <p className="mb-4 last:mb-0 leading-relaxed text-slate-200">{children}</p>,
                          h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white">{children}</h1>,
                          h2: ({children}) => <h2 className="text-xl font-bold mb-3 mt-5 text-white">{children}</h2>,
                          h3: ({children}) => <h3 className="text-lg font-bold mb-3 mt-4 text-white">{children}</h3>,
                          ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-200">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-200">{children}</ol>,
                          li: ({children}) => <li className="leading-relaxed">{children}</li>,
                          a: ({children, href}) => <a href={href} className="text-primary hover:underline" target="_blank" rel="noreferrer">{children}</a>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 bg-primary/5 rounded-r-lg italic text-slate-300">{children}</blockquote>,
                          img: ({node, ...props}) => (`;

code = code.replace(
  /                        components=\{\{\r?\n                          img: \(\{node, \.\.\.props\}\) => \(/g,
  componentsReplacement
);

fs.writeFileSync('app/(main)/assistant/page.tsx', code, 'utf-8');
