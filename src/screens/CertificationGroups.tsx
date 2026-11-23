import { useState, type CSSProperties } from 'react';
import {
  certificationGroups, certificationIntersections, certificationLists, certifiedEmployees, tripleCertificationCount,
} from '../content/certifications';
import { playFeedback } from '../audio/effects';

export function CertificationGroups({ revealedGroups, onReveal }: {
  revealedGroups: readonly string[];
  onReveal: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const employee = certifiedEmployees.find(({ name }) => name === selected);

  return <section className="certification-board" aria-labelledby="certification-heading">
    <h2 id="certification-heading">Crachás de certificação</h2>
    <div className="certification-intersections">
      <h3>Quem aparece em mais de uma lista</h3>
      <dl>
        {certificationIntersections.map(({ label, count }) => <div key={label}>
          <dt>{label}</dt><dd>{count} pessoas</dd>
        </div>)}
        <div><dt>As três certificações</dt><dd>{tripleCertificationCount} pessoas</dd></div>
      </dl>
      <p>Os totais de cada par incluem as duas pessoas que têm as três certificações.</p>
      <p>Há três afastados. Todos têm somente NR-12.</p>
    </div>
    <div className="certification-lists">
      {certificationLists.map(({ id, name, employees }) => {
        const revealed = revealedGroups.includes(id);
        return <section key={id} className="certification-list" aria-label={name}>
          <h3>{name}</h3>
          <p>{employees.length} funcionários</p>
          {!revealed ? <button className="pixel-button secondary" type="button" onClick={() => onReveal(id)}>
            Examinar {id}
          </button> : <ul>
            {employees.map(({ name, ids, away }) => <li key={name} className={selected === name ? 'is-highlighted' : ''}>
              {ids.length > 1 ? <button type="button" aria-pressed={selected === name} onClick={() => {
                setSelected((current) => current === name ? null : name);
                playFeedback('select');
              }}>{name} <small>Repetido</small></button>
                : <span>{name}{away && <small>Afastado</small>}</span>}
            </li>)}
          </ul>}
        </section>;
      })}
    </div>
    <p className="certification-selection" aria-live="polite">
      {employee && <>{employee.name} aparece em {employee.ids.join(', ')}.</>}
    </p>
  </section>;
}

export function CertificationBreakdown({ completed }: { completed: boolean }) {
  return <section className={`certification-breakdown ${completed ? 'is-complete' : ''}`} aria-labelledby="certification-breakdown-heading">
    <h2 id="certification-breakdown-heading">Sete grupos sem repetição</h2>
    <ul className="certification-group-grid">
      {certificationGroups.map(({ label, employees }, index) => <li key={label}
        style={{ '--group-delay': `${index * 55}ms` } as CSSProperties}>
        <strong>{label} · {employees.length}</strong>
        <ul className="certification-badges">
          {employees.map(({ name, away }) => <li key={name} className={away ? 'is-away' : ''}>
            {name}{away && <small>{completed ? 'Retirado' : 'Afastado'}</small>}
          </li>)}
        </ul>
      </li>)}
    </ul>
    {completed && <p className="certification-total"><strong>24 − 3 = 21</strong> coordenadores disponíveis</p>}
  </section>;
}
