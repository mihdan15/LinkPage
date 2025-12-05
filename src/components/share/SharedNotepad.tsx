// SharedNotepad Component
// Requirements: 9.1, 9.2, 9.4, 9.5, 9.6

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Trash2, Check, StickyNote } from 'lucide-react';
import { MAX_NOTEPAD_LENGTH } from '../../utils/validation';
import { useToast } from '../../contexts';

export interface SharedNotepadProps {
  slug: string;
  initialContent?: string;
  maxLength?: number;
  onSave?: (content: string) => Promise<void>;
  onClear?: () => Promise<void>;
  primaryColor?: string;
}

export function SharedNotepad({ slug, initialContent = '', maxLength = MAX_NOTEPAD_LENGTH, onSave, onClear, primaryColor = '#3B82F6' }: SharedNotepadProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();

  useEffect(() => { setContent(initialContent); }, [initialContent]);

  const debouncedSave = useCallback((newContent: string) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      if (onSave) {
        setIsSaving(true);
        setError(null);
        try { await onSave(newContent); } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); } finally { setIsSaving(false); }
      }
    }, 500);
  }, [onSave]);

  useEffect(() => { return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); }; }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length > maxLength) { setError(`Character limit of ${maxLength} exceeded`); return; }
    setError(null);
    setContent(newContent);
    debouncedSave(newContent);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(content); setCopied(true); toast.success('Copied to clipboard!'); setTimeout(() => setCopied(false), 2000); } catch { toast.error('Failed to copy to clipboard'); }
  };

  const handleClear = async () => {
    if (onClear) {
      setIsSaving(true);
      setError(null);
      try { await onClear(); setContent(''); } catch (err) { setError(err instanceof Error ? err.message : 'Failed to clear'); } finally { setIsSaving(false); }
    } else { setContent(''); }
  };

  const characterCount = content.length;
  const isNearLimit = characterCount > maxLength * 0.9;
  const isAtLimit = characterCount >= maxLength;

  return (
    <motion.div className="w-full mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <StickyNote className="w-4 h-4" />
          <span className="text-sm font-medium">Shared Notepad</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button onClick={handleCopy} disabled={!content} className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Copy to clipboard">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
          </motion.button>
          <motion.button onClick={handleClear} disabled={!content || isSaving} className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Clear notepad">
            <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>
      <textarea value={content} onChange={handleChange} placeholder="Write something here... Anyone can see and edit this note." className="w-full h-32 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200" style={{ '--tw-ring-color': primaryColor } as React.CSSProperties} onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`; }} onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }} aria-label={`Shared notepad for ${slug}`} />
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm">{error ? <span className="text-red-500">{error}</span> : isSaving ? <span className="text-gray-400">Saving...</span> : <span className="text-gray-400">&nbsp;</span>}</div>
        <span className={`text-sm ${isAtLimit ? 'text-red-500 font-medium' : isNearLimit ? 'text-yellow-500' : 'text-gray-400'}`}>{characterCount.toLocaleString()} / {maxLength.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}
