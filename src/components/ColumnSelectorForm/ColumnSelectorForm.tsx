import { useRef } from 'react';
import { REQUIRED_COLUMNS } from '../../constants';
import { useColumnStore } from '../../store/columnStore';
import { TableColumn } from '../../types';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './ColumnSelectorForm.module.css';

interface ColumnSelectorFormProps {
  availableColumns: TableColumn[];
  onClose: () => void;
}

export const ColumnSelectorForm = ({ availableColumns, onClose }: ColumnSelectorFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { selectedColumns, setSelectedColumns, toggleColumn } = useColumnStore();

  const optionalColumns = availableColumns.filter((col) => !REQUIRED_COLUMNS.includes(col.key));

  const handleSelectAll = () => {
    setSelectedColumns(optionalColumns.map((col) => col.key));
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.buttonsWrapper}>
        <Button type="button" onClick={handleSelectAll} size="small">
          Select All
        </Button>
        <Button type="button" onClick={handleDeselectAll} size="small">
          Deselect All
        </Button>
      </div>

      <div className={styles.columnsWrapper}>
        {optionalColumns.map((column) => (
          <Checkbox
            key={column.key}
            label={column.label}
            checked={selectedColumns.includes(column.key)}
            onChange={() => toggleColumn(column.key)}
          />
        ))}
      </div>
    </form>
  );
};
