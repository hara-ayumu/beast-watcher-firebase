import { Link } from 'react-router-dom';

function HeaderButtonLink({ to, onClick, children, className = '', ariaLabel }) {
    const defaultClasses = `
        text-blue-600 hover:text-blue-800
        hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300
        transition
    `.replace(/\s+/g, ' ').trim();

    const classes = `${defaultClasses} ${className}`.trim();

    if (to) {
        return (
            <Link to={to} className={classes} aria-label={ariaLabel}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel}>
            {children}
        </button>
    );
}

export default HeaderButtonLink;