import type { ReactNode } from 'react';

interface DisclosureSectionProps {
  title: string;
  description?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function DisclosureSection({
  title,
  description,
  open,
  onToggle,
  children,
}: DisclosureSectionProps) {
  return (
    <section className={`drawerSection drawerDisclosure ${open ? 'is-open' : ''}`}>
      <button
        aria-expanded={open}
        className="drawerDisclosure__trigger"
        onClick={onToggle}
        type="button"
      >
        <span className="drawerDisclosure__copy">
          <span className="drawerDisclosure__title">{title}</span>
          {description ? (
            <span className="drawerDisclosure__description">{description}</span>
          ) : null}
        </span>
        <span aria-hidden="true" className="drawerDisclosure__chevron" />
      </button>
      <div className="drawerDisclosure__body" hidden={!open}>
        {children}
      </div>
    </section>
  );
}
