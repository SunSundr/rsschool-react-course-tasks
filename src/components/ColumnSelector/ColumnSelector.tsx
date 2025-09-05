import { REQUIRED_COLUMNS, REQUIRED_NAMES_COLUMNS } from '../../constants';
import { TableColumn } from '../../types';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './ColumnSelector.module.css';

interface ColumnSelectorProps {
  availableColumns: TableColumn[];
  localSelectedColumns: string[];
  setLocalSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ColumnSelector = ({
  availableColumns,
  localSelectedColumns,
  setLocalSelectedColumns,
}: ColumnSelectorProps) => {
  const handleSelectAll = () => {
    setLocalSelectedColumns(availableColumns.map((col) => col.key));
  };

  const handleDeselectAll = () => {
    setLocalSelectedColumns(REQUIRED_NAMES_COLUMNS);
  };

  const onChange = (column: TableColumn) => {
    if (localSelectedColumns.includes(column.key)) {
      setLocalSelectedColumns(localSelectedColumns.filter((key) => key !== column.key));
    } else {
      setLocalSelectedColumns([...localSelectedColumns, column.key]);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.buttonsWrapper}>
        <Button
          type="button"
          onClick={handleSelectAll}
          size="small"
          disabled={availableColumns.length === localSelectedColumns.length}
        >
          Select All
        </Button>
        <Button
          type="button"
          onClick={handleDeselectAll}
          size="small"
          disabled={localSelectedColumns.length === REQUIRED_COLUMNS.length}
        >
          Deselect All
        </Button>
      </div>

      <div className={styles.columnsWrapper}>
        {availableColumns.map((column) => (
          <Checkbox
            key={column.key}
            label={column.label}
            checked={localSelectedColumns.includes(column.key)}
            onChange={() => onChange(column)}
            disabled={REQUIRED_NAMES_COLUMNS.includes(column.key)}
          />
        ))}
      </div>
    </div>
  );
};
