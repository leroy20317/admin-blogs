import { ChangeEventHandler, FC, memo, useEffect, useRef, useState } from 'react';
import {
  CodeOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  MinusSquareOutlined,
  PictureOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { useFullscreen } from 'ahooks';
import ReactMarkdown from 'react-markdown';
import * as monaco from 'monaco-editor';
import { Divider, Space, Tooltip } from 'antd';
import styles from './index.less';
import { upload } from '@/services/common';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import theme from 'react-syntax-highlighter/dist/esm/styles/prism/coy';

interface Props {
  value?: string;
  onChange?: (...agm: any[]) => void;
  height?: number;
}

const Editor: FC<Props> = ({ value, onChange, height = 800 }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const divEl = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>();
  const [status, setStatus] = useState<'split' | 'preview' | 'edit'>('edit');
  const [isFullscreen, { enterFullscreen, exitFullscreen }] = useFullscreen(boxRef);

  const insertContent = (text: string) => {
    const selection = editor.current?.getSelection();
    if (!selection) return;
    const range = new monaco.Range(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.endColumn,
    );
    const id = { major: 1, minor: 1 };
    const op = { identifier: id, range: range, text, forceMoveMarkers: true };
    editor.current?.executeEdits(null, [op]);
  };
  useEffect(() => {
    if (divEl.current) {
      editor.current = monaco.editor.create(divEl.current, {
        value,
        language: 'markdown',
        quickSuggestions: true,
        minimap: { enabled: false },
        // theme: 'vs-dark',
        acceptSuggestionOnEnter: 'on',
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true, //编辑器自适应布局
        wordSeparators: '~!@#$%^&*()-=+[{]}|;:\'",.<>/?',
        wordWrapBreakAfterCharacters: '\t})]?|&,;',
        wordWrapBreakBeforeCharacters: '{([+',
      });
      editor.current.onDidChangeModelContent(function () {
        const newValue = editor.current?.getValue();
        onChange?.(newValue);
      });
    }
    return () => {
      editor.current?.dispose();
    };
  }, []);

  const onFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = '';
    if (!file) return;
    const res = await upload({
      type: 'cdn',
      file,
    });
    insertContent(`![${res.body.filename}](${res.body.url})`);
  };

  const list = [
    {
      title: '上传图片',
      component: (
        <div className="anticon" style={{ position: 'relative' }}>
          <PictureOutlined />
          <input
            type="file"
            className={styles.file}
            title=""
            onChange={onFileChange}
            accept="audio/*,video/*,image/*"
            ref={fileRef}
          />
        </div>
      ),
    },
    { title: '全屏', component: <FullscreenOutlined onClick={enterFullscreen} /> },
    { title: '取消全屏', component: <FullscreenExitOutlined onClick={exitFullscreen} /> },
    { title: '编辑模式', component: <CodeOutlined onClick={() => setStatus('edit')} /> },
    {
      title: '分屏模式',
      component: (
        <MinusSquareOutlined
          style={{ transform: 'rotate(90deg)' }}
          onClick={() => setStatus('split')}
        />
      ),
    },
    { title: '预览模式', component: <ReadOutlined onClick={() => setStatus('preview')} /> },
  ];

  return (
    <div className={styles.editor} ref={boxRef}>
      <Space className={styles.tab} split={<Divider type="vertical" />}>
        {list.map((item) => (
          <Tooltip key={item.title} title={item.title} placement="bottom">
            {item.component}
          </Tooltip>
        ))}
      </Space>
      <div
        className={`${styles.main} ${styles[status]}`}
        style={{ height: isFullscreen ? 'calc(100vh - 40px)' : height }}
      >
        <div className={styles.left}>
          <div className="Editor" ref={divEl} style={{ height: '100%' }} />
        </div>
        <div className={styles.right} style={{ overflow: 'auto', padding: 8 }}>
          <ReactMarkdown
            components={{
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={theme as any}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      fontSize: 14,
                      overflow: 'auto',
                      backgroundColor: '#f6f8fa',
                      padding: 16,
                    }}
                    codeTagProps={{ className }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {value || ''}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default memo(Editor);
