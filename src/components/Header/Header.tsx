'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { APP_NAME, QUERY_KEY, SEARCH_KEY } from '~/constants';
import { Link } from '~/i18n/navigation';
import useThemeNext from '~/theme/useTheme';
import { Theme } from '~/types';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useThemeNext();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('header');

  useEffect(() => {
    const handleScroll = () => {
      if (isThemeDropdownOpen) setIsThemeDropdownOpen(false);
      if (isLangDropdownOpen) setIsLangDropdownOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeDropdownOpen, isLangDropdownOpen]);

  const handleHomeClick = () => {
    const params = new URLSearchParams(searchParams);
    if (params.has(SEARCH_KEY)) params.delete(SEARCH_KEY);
    const defaultQuery = params.get(QUERY_KEY);
    if (!defaultQuery || defaultQuery === 'topRated') {
      params.set(QUERY_KEY, 'popular');
    } else if (defaultQuery === 'popular') {
      params.delete(QUERY_KEY);
    }
    startTransition(() => router.push(`/?${params.toString()}`));
  };

  const toggleThemeDropdown = () => {
    setIsThemeDropdownOpen((prev) => !prev);
    setIsLangDropdownOpen(false);
  };

  const toggleLangDropdown = () => {
    setIsLangDropdownOpen((prev) => !prev);
    setIsThemeDropdownOpen(false);
  };

  const handleDarkTheme = () => {
    setTheme(Theme.Dark);
    setIsThemeDropdownOpen(false);
  };

  const handleLightTheme = () => {
    setTheme(Theme.Light);
    setIsThemeDropdownOpen(false);
  };

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsLangDropdownOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <style>{`
        :root {
          --scrollbar-track: ${theme === Theme.Dark ? '#0a0a0a' : 'whitesmoke'};
        }
      `}</style>
        <div className={styles.logo}>
          <Image
            src="/tmdb.png"
            alt="No image available"
            height={48}
            width={48}
            className={styles.image}
          />

          <button type="button" className={styles.textButton} onClick={handleHomeClick}>
            {APP_NAME}
          </button>
        </div>

        <div className={styles.leftItems}>
          <div className={styles.dropdownContainer} ref={langDropdownRef}>
            <div className={styles.dropdownMenu} onClick={toggleLangDropdown}>
              <svg
                viewBox="0 0 24 24"
                focusable="false"
                width="1em"
                height="1em"
                aria-hidden="true"
              >
                <path
                  d={`M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5
                  7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4
                  19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21
                  22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z`}
                />
              </svg>
            </div>

            <div className={`${styles.dropdownContent} ${isLangDropdownOpen ? styles.show : ''}`}>
              <div className={styles.dropdownItem} onClick={() => handleLanguageChange('en')}>
                <span className={styles.dropdownTitle}>English</span>
              </div>
              <div className={styles.dropdownItem} onClick={() => handleLanguageChange('ru')}>
                <span className={styles.dropdownTitle}>Русский</span>
              </div>
              <div className={styles.dropdownItem} onClick={() => handleLanguageChange('ua')}>
                <span className={styles.dropdownTitle}>Українська</span>
              </div>
            </div>
          </div>

          <div className={styles.dropdownContainer} ref={themeDropdownRef}>
            <div className={styles.dropdownMenu} onClick={toggleThemeDropdown}>
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="skin"
                width="1em"
                height="1em"
                aria-hidden="true"
              >
                <path
                  d={`M870 126H663.8c-17.4 0-32.9 11.9-37 29.3C614.3 208.1 567 246 512 246s-102.3-37.9-114.8-90.7a37.93 37.93 0
                00-37-29.3H154a44 44 0 00-44 44v252a44 44 0 0044 44h75v388a44 44 0 0044 44h478a44 44 0 0044-44V466h75a44
                44 0 0044-44V170a44 44 0 00-44-44zm-28 268H723v432H301V394H182V198h153.3c28.2
                71.2 97.5 120 176.7 120s148.5-48.8 176.7-120H842v196z`}
                ></path>
              </svg>
            </div>

            <div className={`${styles.dropdownContent} ${isThemeDropdownOpen ? styles.show : ''}`}>
              <div className={styles.dropdownItem} onClick={handleDarkTheme}>
                <svg
                  fillRule="evenodd"
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="moon"
                  width="1em"
                  height="1em"
                  aria-hidden="true"
                  className={styles.dropdownItem}
                >
                  <path
                    d={`M489.5 111.66c30.65-1.8 45.98 36.44 22.58 56.33A243.35 243.35 0 00426 354c0 134.76 109.24 244 244 244 72.58 0 139.9-31.83
              186.01-86.08 19.87-23.38 58.07-8.1 56.34 22.53C900.4 745.82 725.15 912 512.5 912 291.31 912 112 732.69 112 511.5c0-211.39
              164.29-386.02 374.2-399.65l.2-.01zm-81.15 79.75l-4.11 1.36C271.1 237.94 176 364.09 176 511.5 176 697.34 326.66 848 512.5
              848c148.28 0 274.94-96.2 319.45-230.41l.63-1.93-.11.07a307.06 307.06 0 01-159.73 46.26L670 662c-170.1 0-308-137.9-308-308
              0-58.6 16.48-114.54 46.27-162.47z`}
                  ></path>
                </svg>
                <span className={styles.dropdownTitle}>{t('dark')}</span>
              </div>

              <div className={styles.dropdownItem} onClick={handleLightTheme}>
                <svg
                  fillRule="evenodd"
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="sun"
                  width="1em"
                  height="1em"
                  aria-hidden="true"
                  className={styles.dropdownItem}
                >
                  <path
                    d={`M548 818v126a16 16 0 01-16 16h-40a16 16 0 01-16-16V818c15.85 1.64 27.84 2.46 36 2.46 8.15 0 20.16-.82 36-2.46m205.25-115.66l89.1
              89.1a16 16 0 010 22.62l-28.29 28.29a16 16 0 01-22.62 0l-89.1-89.1c12.37-10.04 21.43-17.95 27.2-23.71 5.76-5.77 13.67-14.84 23.71-27.2m-482.5
              0c10.04 12.36 17.95 21.43 23.71 27.2 5.77 5.76 14.84 13.67 27.2 23.71l-89.1 89.1a16 16 0 01-22.62 0l-28.29-28.29a16 16 0 010-22.63zM512
              278c129.24 0 234 104.77 234 234S641.24 746 512 746 278 641.24 278 512s104.77-234 234-234m0 72c-89.47 0-162 72.53-162 162s72.53 162 162 162
              162-72.53 162-162-72.53-162-162-162M206 476c-1.64 15.85-2.46 27.84-2.46 36 0 8.15.82 20.16 2.46 36H80a16 16 0 01-16-16v-40a16
              16 0 0116-16zm738 0a16 16 0 0116 16v40a16 16 0 01-16 16H818c1.64-15.85 2.46-27.84 2.46-36 0-8.15-.82-20.16-2.46-36zM814.06
              180.65l28.29 28.29a16 16 0 010 22.63l-89.1 89.09c-10.04-12.37-17.95-21.43-23.71-27.2-5.77-5.76-14.84-13.67-27.2-23.71l89.1-89.1a16
              16 0 0122.62 0m-581.5 0l89.1 89.1c-12.37 10.04-21.43 17.95-27.2 23.71-5.76 5.77-14.84 13.67-27.2 23.71l-89.1-89.1a16
              16 0 010-22.62l28.29-28.29a16 16 0 0122.62 0M532 64a16 16 0 0116 16v126c-15.85-1.64-27.84-2.46-36-2.46-8.15
              0-20.16.82-36 2.46V80a16 16 0 0116-16z`}
                  ></path>
                </svg>
                <span className={styles.dropdownTitle}>{t('light')}</span>
              </div>
            </div>
          </div>

          <Link href="/about" className={styles.linkButton} prefetch={true}>
            {t('about')}
          </Link>
        </div>
      </header>
      {isPending && <LoadingSpinner overlay={true} />}
    </>
  );
};
