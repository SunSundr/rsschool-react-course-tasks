import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNewEntryId } from '~/store/formSlice';
import { RootState } from '~/store/store';
import { Button } from '../Button/Button';
import { HookForm } from '../HookForms/HookForm';
import { Modal } from '../Modal/Modal';
import { UncontrolledForm } from '../UncontrolledForm/UncontrolledForm';
import styles from './MainComponent.module.css';

export const MainComponent = () => {
  const [isUncontrolledModalOpen, setIsUncontrolledModalOpen] = useState(false);
  const [isHookModalOpen, setIsHookModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { formHistory, newEntryId } = useSelector((state: RootState) => state.form);

  useEffect(() => {
    if (newEntryId !== null) {
      const timer = setTimeout(() => {
        dispatch(clearNewEntryId());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newEntryId, dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Form Submissions</h1>
        <div className={styles.buttonGroup}>
          <Button
            onClick={() => setIsUncontrolledModalOpen(true)}
            {...{ style: { minWidth: '200px' } }}
          >
            Uncontrolled Form
          </Button>
          <Button onClick={() => setIsHookModalOpen(true)} {...{ style: { minWidth: '200px' } }}>
            Hook Form
          </Button>
        </div>
      </div>

      {formHistory.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No form submissions yet. Create your first submission using the buttons above.</p>
        </div>
      ) : (
        <div className={styles.cardsContainer}>
          {formHistory.map((formData, index) => (
            <div
              key={index}
              className={`${styles.card} ${newEntryId === index ? styles.highlight : ''}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.formType}>{formData.type}</span>
                {formData.picture && (
                  <div className={styles.avatar}>
                    <img src={formData.picture} alt="Avatar" />
                  </div>
                )}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.field}>
                  <span className={styles.label}>Name:</span>
                  <span className={styles.value}>{formData.name}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{formData.email}</span>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <span className={styles.label}>Age:</span>
                    <span className={styles.value}>{formData.age}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Gender:</span>
                    <span className={styles.value}>{formData.gender}</span>
                  </div>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Country:</span>
                  <span className={styles.value}>{formData.country}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Terms:</span>
                  <span
                    className={`${styles.value} ${formData.terms ? styles.accepted : styles.rejected}`}
                  >
                    {formData.terms ? 'Accepted' : 'Not Accepted'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isUncontrolledModalOpen}
        onClose={() => setIsUncontrolledModalOpen(false)}
        title="Uncontrolled Form"
      >
        <UncontrolledForm onClose={() => setIsUncontrolledModalOpen(false)} />
      </Modal>

      <Modal isOpen={isHookModalOpen} onClose={() => setIsHookModalOpen(false)} title="Hook Form">
        <HookForm onClose={() => setIsHookModalOpen(false)} />
      </Modal>
    </div>
  );
};
