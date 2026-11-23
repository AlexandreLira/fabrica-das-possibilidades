export const certifications = [
  { id: 'NR-10', name: 'Elétrica' },
  { id: 'NR-12', name: 'Máquinas' },
  { id: 'NR-35', name: 'Trabalho em altura' },
] as const;

type CertificationId = (typeof certifications)[number]['id'];

const employeeGroups: ReadonlyArray<{
  ids: readonly CertificationId[];
  names: readonly string[];
  away?: readonly string[];
}> = [
  { ids: ['NR-10'], names: ['Alice', 'Bruno', 'Clara', 'Diego', 'Elisa', 'Fábio', 'Gabriela'] },
  { ids: ['NR-12'], names: ['Helena', 'Igor'], away: ['Júlia', 'Kaique', 'Lia'] },
  { ids: ['NR-35'], names: ['Marcos', 'Nina', 'Otávio', 'Paula'] },
  { ids: ['NR-10', 'NR-12'], names: ['Raquel', 'Samuel', 'Tainá'] },
  { ids: ['NR-10', 'NR-35'], names: ['Úrsula', 'Victor'] },
  { ids: ['NR-12', 'NR-35'], names: ['Wesley'] },
  { ids: ['NR-10', 'NR-12', 'NR-35'], names: ['Yara', 'Zeca'] },
];

export const certificationGroups = employeeGroups.map(({ ids, names, away = [] }) => ({
  ids,
  label: ids.length === 1 ? `Somente ${ids[0]}` : ids.join(' + '),
  employees: [
    ...names.map((name) => ({ name, ids, away: false })),
    ...away.map((name) => ({ name, ids, away: true })),
  ],
}));

export const certifiedEmployees = certificationGroups.flatMap(({ employees }) => employees);

export const certificationLists = certifications.map(({ id, name }) => ({
  id,
  name: `${id} · ${name}`,
  employees: certifiedEmployees.filter(({ ids }) => ids.includes(id)),
}));

export const certificationIntersections = certificationGroups.filter(({ ids }) => ids.length === 2).map(({ ids }) => ({
  label: ids.join(' e '),
  count: certifiedEmployees.filter((employee) => ids.every((id) => employee.ids.includes(id))).length,
}));

export const tripleCertificationCount = certifiedEmployees.filter(({ ids }) => ids.length === 3).length;
