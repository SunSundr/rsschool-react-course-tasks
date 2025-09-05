import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DelayTime } from '~/constants';
import { classNames } from '~/utils/classNames';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setIsVisible(true);
      const checkElementReady = () => {
        const element = modalRef.current;
        if (element && element.offsetParent !== null) {
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            element.classList.add(styles.modalOpen);
            element.focus();
          } else {
            requestAnimationFrame(checkElementReady);
          }
        } else {
          requestAnimationFrame(checkElementReady);
        }
      };
      requestAnimationFrame(checkElementReady);
    } else {
      if (!modalRef.current) return;
      modalRef.current.classList.remove(styles.modalOpen);
      modalRef.current.classList.add(styles.modalPreClose);
      const time = Date.now();
      modalRef.current.addEventListener(
        'transitionend',
        async () => {
          if (Date.now() - time < DelayTime.Max) {
            await new Promise((resolve) =>
              setTimeout(resolve, DelayTime.Max - (Date.now() - time)),
            );
          }
          setIsVisible(false);
          setTimeout(() => previousFocusRef.current?.focus(), DelayTime.Zero);
        },
        {
          once: true,
        },
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const winWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  if (!isVisible) return null;

  return createPortal(
    <div
      className={classNames(styles.modalBackdrop, { [styles.Open]: isOpen })}
      onMouseDown={handleBackdropClick}
    >
      <div
        className={styles.modalContent}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="modal-title">{title}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
            &#215;
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
      <style>
        {`:root { overflow: hidden; } 
         .${styles.modalContent} { overflow-y: ${isOpen && winWidth < 768 ? 'auto' : 'unset'};}`}
      </style>
    </div>,
    document.body,
  );
};
