import { useNavigate } from 'react-router-dom';
import { TASK } from '~/constants';
import styles from './About.module.css';

export const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={() => navigate('/')}>
        <span className={styles.closeCrossText}>&#xD7;</span>
      </button>
      <div className={styles.content}>
        <div className={styles.header}>
          <img src={TASK.avatar} alt="Aleksandr Kovalenko" className={styles.avatar} />
          <div className={styles.intro}>
            <h1 className={styles.title}>About Me</h1>
            <h2 className={styles.name}>Aleksandr Kovalenko</h2>
            <h3 className={styles.nickname}>SunSundr</h3>
            <p className={styles.subtitle}>Beginner Fullstack Developer</p>
          </div>
        </div>

        <div className={styles.description}>
          <p>
            {`Hello! I'm Alexander, a passionate beginner fullstack developer currently living in the
            beautiful city of Batumi 🌊. When I'm not busy turning coffee into code, you can find me
            exploring the latest web technologies or debugging why my CSS doesn't work (spoiler:
            it's usually a missing semicolon).`}
          </p>

          <p>
            {`I love programming because it's the only place where you can create something from
            nothing, break it completely, fix it again, and call it "learning experience". My
            favorite debugging technique is explaining the problem to my rubber duck – surprisingly
            effective! 🦆`}
          </p>

          <p>
            {`When I'm not coding, I enjoy having a good time with friends, exploring Batumi's amazing
            food scene, and pretending I understand what "Big O notation" really means. Fun fact: I
            once spent 3 hours debugging a problem that was solved by restarting the server. We've
            all been there, right? 😅`}
          </p>

          <div className={styles.taskLink}>
            <p>
              This application was built as part of the
              <a
                href="https://rs.school/courses/reactjs"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                RS School React course
              </a>
              :
            </p>

            <a
              href="https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/functional-routing.md"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              📚 View Task Requirements
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
