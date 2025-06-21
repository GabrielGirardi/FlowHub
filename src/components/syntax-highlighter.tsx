import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('sql', sql);

interface CodeHighlighterProps {
    code: string;
    language: string;
    theme?: 'dark' | 'light';
    customStyle?: React.CSSProperties;
}

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
     code,
     language,
     theme = 'dark',
     customStyle = {},
 }) => {
    return (
        <div className="relative rounded-md overflow-hidden w-full">
            <div className="max-w-full max-h-[600px] overflow-scroll">
                <SyntaxHighlighter
                    language={language}
                    style={theme === 'dark' ? atomDark : vs}
                    customStyle={{
                        margin: 0,
                        borderRadius: '0.375rem',
                        fontSize: '0.9rem',
                        ...customStyle
                    }}
                    wrapLines={true}
                    wrapLongLines={false}
                    codeTagProps={{
                        style: {
                            fontFamily: 'monospace',
                            whiteSpace: 'pre',
                        }
                    }}
                    showLineNumbers
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeHighlighter;