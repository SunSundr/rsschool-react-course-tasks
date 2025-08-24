import { Link } from 'react-router-dom';

export const Main = () => {
  return (
    <div>
      <h1>Main Page</h1>
      <nav>
        <Link to="/uncontrolled-form">Uncontrolled Form</Link>
        <Link to="/hook-form">Hook Form</Link>
      </nav>
    </div>
  );
};
