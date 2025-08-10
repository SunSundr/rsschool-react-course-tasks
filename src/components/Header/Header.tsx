import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { APP_NAME, QUERY_KEY } from '~/constants';
import { useResetQueries } from '~/hooks/useRefreshData';
import { useWindowEvent } from '~/hooks/useWindowEvent';
import { useStore } from '~/store/store';
import useTheme from '~/theme/useTheme';
import { QueryType, Theme } from '~/types';
import styles from './Header.module.css';

interface HeaderProps {
  updateContext: () => void;
}

export const Header: React.FC<HeaderProps> = ({ updateContext }) => {
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { clearVideos } = useStore();
  const { theme, setTheme } = useTheme();
  const { resetMoviesQueries } = useResetQueries();

  useWindowEvent(
    'scroll',
    () => {
      if (isDropdownOpen) setIsDropdownOpen(false);
    },
    { passive: true },
  );

  useWindowEvent('mousedown', (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  });

  const toggleQueryType = () => {
    if (location.pathname === '/' || location.pathname.startsWith('/detailed')) {
      const type: QueryType = 'popular';
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (params.get(QUERY_KEY) === type) {
          params.delete(QUERY_KEY);
        } else {
          params.set(QUERY_KEY, type);
        }
        return params;
      });
      resetMoviesQueries();
    } else {
      navigate('/');
      return;
    }
  };

  const setQuery = () => {
    toggleQueryType();
    clearVideos();
    setTimeout(() => updateContext(), 350);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDarkTheme = () => {
    setTheme(Theme.Dark);
    setIsDropdownOpen(false);
  };

  const handleLightTheme = () => {
    setIsDropdownOpen(false);
    setTheme(Theme.Light);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <style>{`:root { --scrollbar-track: ${theme === Theme.Dark ? '#0a0a0a' : 'whitesmoke'};`}</style>
      <div className={styles.logo}>
        <img className={styles.image} src="/tmdb.png" alt="No image available" />
        <button onClick={setQuery} type="button" className={styles.textButton}>
          {APP_NAME}
        </button>
      </div>

      <div className={styles.leftItems}>
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <div className={styles.dropdownMenu} onClick={toggleDropdown}>
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

          <div className={`${styles.dropdownContent} ${isDropdownOpen ? styles.show : ''}`}>
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
              <span className={styles.dropdownTitle}>Dark</span>
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
              <span className={styles.dropdownTitle}>Light</span>
            </div>
          </div>
        </div>

        <Link to="/about" className={styles.linkButton}>
          About
        </Link>
      </div>
    </header>
  );
};
