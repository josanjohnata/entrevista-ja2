import React, { useRef, useCallback, useState, useEffect } from 'react';
import * as S from '../CurriculoTurboScreen.styles';

interface ScrollTextareaProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export const ScrollTextarea: React.FC<ScrollTextareaProps> = ({
  placeholder,
  value,
  onChange,
  disabled,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(100);
  const [showThumb, setShowThumb] = useState(false);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  const updateThumb = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const canScroll = scrollHeight > clientHeight;
    setShowThumb(canScroll);

    if (!canScroll) return;

    const ratio = clientHeight / scrollHeight;
    const height = Math.max(ratio * 100, 10);
    const maxScroll = scrollHeight - clientHeight;
    const top = (scrollTop / maxScroll) * (100 - height);

    setThumbHeight(height);
    setThumbTop(top);
  }, []);

  useEffect(() => {
    updateThumb();
  }, [value, updateThumb]);

  const handleScroll = useCallback(() => {
    updateThumb();
  }, [updateThumb]);

  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging.current = true;
      dragStartY.current = e.clientY;
      dragStartScroll.current = textareaRef.current?.scrollTop || 0;

      const handleMouseMove = (ev: MouseEvent) => {
        if (!isDragging.current || !textareaRef.current || !trackRef.current)
          return;

        const el = textareaRef.current;
        const trackHeight = trackRef.current.clientHeight;
        const delta = ev.clientY - dragStartY.current;
        const scrollRatio =
          (el.scrollHeight - el.clientHeight) / (trackHeight - (trackHeight * thumbHeight) / 100);
        el.scrollTop = dragStartScroll.current + delta * scrollRatio;
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [thumbHeight]
  );

  return (
    <S.TextareaWrapper>
      <S.FormTextarea
        ref={textareaRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        disabled={disabled}
      />
      {showThumb && (
        <S.ScrollTrack ref={trackRef}>
          <S.ScrollThumb
            $top={thumbTop}
            $height={thumbHeight}
            onMouseDown={handleThumbMouseDown}
          />
        </S.ScrollTrack>
      )}
    </S.TextareaWrapper>
  );
};
