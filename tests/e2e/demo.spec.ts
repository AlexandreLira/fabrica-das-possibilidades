import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

async function completeAddition(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /Examinar rota local/ }).click();
  await page.getByRole('button', { name: /Examinar rota expressa/ }).click();
  await page.locator('.answer-options label').filter({ hasText: '7' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
}

async function completeMultiplication(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Carcaça ciano' }).click();
  await page.getByRole('button', { name: 'Antena de haste' }).click();
  await page.locator('.answer-options label').filter({ hasText: '6' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
}

async function distribute322(page: import('@playwright/test').Page) {
  for (const box of [1, 1, 1, 2, 2, 3, 3]) {
    await page.getByRole('button', { name: `Colocar peça na caixa ${box}` }).click();
  }
}

async function chooseAnswer(page: import('@playwright/test').Page, answer: number) {
  await page.locator('.answer-options label').filter({ hasText: String(answer) }).click();
}

test('mapa oferece fases funcionais nos três setores', async ({ page }) => {
  await page.goto('/#/setores');
  await expect(page.getByRole('link', { name: 'Jogar fase de Adição' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Jogar fase de Multiplicação' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Jogar fase de Casas de Pombo' })).toBeVisible();
  await expect(page.locator('.sector-phase a')).toHaveCount(15);
});

test('monta um robô, explica o erro e apresenta as seis combinações', async ({ page }) => {
  await page.goto('/#/desafios/multiplicacao-1');
  await expect(page.getByRole('heading', { name: 'Monte o robô' })).toBeFocused();
  await expect(page.getByText('Escolha uma das três carcaças')).toBeVisible();

  const answer = page.getByRole('radio', { name: '6' });
  await expect(answer).toBeDisabled();
  await page.getByRole('button', { name: 'Carcaça ciano' }).click();
  await page.getByRole('button', { name: 'Antena de haste' }).click();
  await expect(answer).toBeEnabled();

  await page.locator('.answer-options label').filter({ hasText: '5' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('Somar conta peças');

  await page.locator('.answer-options label').filter({ hasText: '6' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('3 × 2 = 6');
  await expect(page.getByRole('list', { name: '6 modelos possíveis' }).getByRole('listitem')).toHaveCount(6);

  await page.getByRole('button', { name: 'Jogar novamente' }).click();
  await expect(page.getByRole('button', { name: 'Carcaça ciano' })).toHaveAttribute('aria-pressed', 'false');
});

test('distribui sete peças, reinicia e conclui Casas de Pombo', async ({ page }) => {
  await page.goto('/#/desafios/casas-de-pombo-1');
  await page.getByRole('button', { name: 'Colocar peça na caixa 1' }).click();
  await expect(page.getByText('6 peças restantes')).toBeVisible();
  await page.getByRole('button', { name: 'Reiniciar distribuição' }).click();
  await expect(page.getByText('7 peças restantes')).toBeVisible();

  await distribute322(page);
  await expect(page.getByText('0 peças restantes')).toBeVisible();
  await page.locator('.answer-options label').filter({ hasText: '2' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('apenas 6');

  await page.locator('.answer-options label').filter({ hasText: '3' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('pelo menos 3');
  await expect(page.getByText(/3–2–2 mostra que não podemos garantir 4/)).toBeVisible();
});

test('comunica a distribuição atual nos controles acessíveis das caixas', async ({ page }) => {
  await page.goto('/#/desafios/casas-de-pombo-1');
  const firstBox = page.getByRole('button', { name: /Caixa 1: 0 peças.*Colocar peça na caixa 1/ });
  await expect(firstBox).toBeVisible();
  await firstBox.click();
  await expect(page.getByRole('button', { name: /Caixa 1: 1 peça.*Colocar peça na caixa 1/ })).toBeVisible();
  await expect(page.getByText('Distribuição atual: caixa 1 com 1 peça; caixa 2 com 0 peças; caixa 3 com 0 peças.')).toBeVisible();
});

test('conclui as quinze fases em sequência e mostra o resumo final', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('/#/desafios/adicao-1');
  await completeAddition(page);
  await page.getByRole('link', { name: 'Continuar para Separação de Produtos' }).click();
  for (const group of ['produtos vermelhos', 'produtos azuis']) await page.getByRole('button', { name: new RegExp(`Examinar ${group}`, 'i') }).click();
  await chooseAnswer(page, 7);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.getByRole('link', { name: 'Continuar para Escolha de Materiais' }).click();
  for (const group of ['Ferramentas', 'Peças metálicas', 'Componentes eletrônicos']) await page.getByRole('button', { name: new RegExp(`Examinar ${group}`, 'i') }).click();
  await chooseAnswer(page, 12);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.getByRole('link', { name: 'Continuar para A Grande Produção' }).click();
  for (const sector of ['mecânico', 'elétrico', 'administrativo', 'logística']) {
    await page.getByRole('button', { name: `Examinar ${sector}` }).click();
  }
  await chooseAnswer(page, 23);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.getByRole('link', { name: 'Continuar para Certificação Tripla' }).click();
  for (const id of ['NR-10', 'NR-12', 'NR-35']) {
    await page.getByRole('button', { name: `Examinar ${id}` }).click();
  }
  await chooseAnswer(page, 21);
  await page.getByRole('button', { name: 'Enviar Resposta' }).click();
  await page.getByRole('link', { name: 'Continuar para Monte o robô' }).click();
  await completeMultiplication(page);
  await page.getByRole('link', { name: 'Continuar para Montagem de Robôs' }).click();
  await page.getByRole('group', { name: 'Modelo de corpo' }).getByRole('button', { name: 'Corpo 4' }).click();
  await page.getByRole('group', { name: 'Modelo de rodas' }).getByRole('button', { name: 'Rodas 3' }).click();
  await chooseAnswer(page, 12);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.getByRole('link', { name: 'Continuar para Caminhos da Fábrica' }).click();
  for (const stage of ['Setor 1', 'Setor 2', 'Setor 3']) await page.getByRole('group', { name: stage }).getByRole('button').first().click();
  await chooseAnswer(page, 12);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.getByRole('link', { name: 'Continuar para Robô Completo' }).click();
  for (const part of ['Cabeça 1', 'Corpo 1', 'Braços 1', 'Sensor 1']) {
    await page.getByRole('button', { name: part, exact: true }).click();
  }
  await chooseAnswer(page, 36);
  await page.getByRole('button', { name: 'Enviar Resposta' }).click();
  await page.getByRole('link', { name: 'Continuar para Código do Cofre' }).click();
  for (const key of ['A', '1', '2', '0']) await page.getByRole('button', { name: key, exact: true }).click();
  await page.getByRole('button', { name: 'Testar código' }).click();
  await page.locator('.answer-options label').filter({ hasText: '1.640' }).click();
  await page.getByRole('button', { name: 'Enviar Resposta' }).click();
  await page.getByRole('link', { name: 'Continuar para Organize o depósito' }).click();
  await distribute322(page);
  await page.locator('.answer-options label').filter({ hasText: '3' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.getByRole('link', { name: 'Continuar para O Armazém no Limite' }).click();
  const firstCompartment = page.getByRole('button', { name: /Colocar caixa no compartimento 1/ });
  for (let count = 0; count < 13; count += 1) await firstCompartment.click();
  await chooseAnswer(page, 3);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.getByRole('link', { name: 'Continuar para O Controle de Qualidade' }).click();
  const categories = ['Elétrico', 'Mecânico', 'Acabamento', 'Conexão', 'Montagem', 'Isolamento'];
  for (let count = 0; count < 31; count += 1) {
    const category = categories[count % categories.length]!;
    await page.getByRole('button', { name: new RegExp(`Colocar componente na categoria ${category}`) }).click();
  }
  await chooseAnswer(page, 6);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.getByRole('link', { name: 'Continuar para Operação Linha de Produção' }).click();
  for (let line = 1; line <= 7; line += 1) {
    await page.getByRole('button', { name: new RegExp(`Preencher linha ${line}`) }).click();
  }
  await chooseAnswer(page, 78);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.getByRole('link', { name: 'Continuar para Depósito Crítico' }).click();
  await page.getByRole('button', { name: 'Retirar peça' }).click();
  await chooseAnswer(page, 42);
  await page.getByRole('button', { name: 'Enviar Resposta' }).click();
  await page.getByRole('link', { name: 'Ver resumo final' }).click();

  await expect(page.getByRole('heading', { name: 'Fábrica em funcionamento!' })).toBeFocused();
  await expect(page.getByText(/concluiu todas as fases disponíveis/)).toBeVisible();
  await expect(page.getByText('OU entre grupos distintos')).toBeVisible();
  await expect(page.getByText('E entre etapas independentes')).toBeVisible();
  await expect(page.getByText('ocupação mínima garantida')).toBeVisible();
});

test('mantém um único canvas ao alternar entre as três fases', async ({ page }) => {
  for (const route of ['adicao-1', 'multiplicacao-1', 'casas-de-pombo-1']) {
    await page.goto(`/#/desafios/${route}`);
    await expect(page.locator('.challenge-game canvas')).toHaveCount(1);
  }
});

test('mantém Multiplicação e Casas de Pombo jogáveis sem Phaser', async ({ page }) => {
  await page.route(/.*\/assets\/.*(?:challengeEngine|phaser).*\.js$/, (route) => route.abort());
  await page.goto('/#/desafios/multiplicacao-1');
  await expect(page.getByText('A animação da fábrica está indisponível.')).toBeVisible();
  await expect(page.locator('.challenge-static')).toBeVisible();
  await completeMultiplication(page);
  await expect(page.getByRole('link', { name: 'Continuar para Montagem de Robôs' })).toBeVisible();

  await page.goto('/#/desafios/casas-de-pombo-1');
  await expect(page.getByText('A animação da fábrica está indisponível.')).toBeVisible();
  await distribute322(page);
  await page.locator('.answer-options label').filter({ hasText: '3' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('link', { name: 'Continuar para O Armazém no Limite' })).toBeVisible();
});

for (const width of [320, 390]) {
  test(`mantém todas as fases sem rolagem horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of ['adicao-1', 'adicao-2', 'adicao-3', 'adicao-4', 'adicao-5', 'multiplicacao-1', 'multiplicacao-2', 'multiplicacao-3', 'multiplicacao-4', 'multiplicacao-5', 'casas-de-pombo-1', 'casas-de-pombo-2', 'casas-de-pombo-3', 'casas-de-pombo-4', 'casas-de-pombo-5']) {
      await page.goto(`/#/desafios/${route}`);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.goto('/#/conclusao');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('conclui Multiplicação e Casas de Pombo usando controles de teclado', async ({ page }) => {
  await page.goto('/#/desafios/multiplicacao-1');
  const body = page.getByRole('button', { name: 'Carcaça ciano' });
  await body.focus();
  await page.keyboard.press('Enter');
  const antenna = page.getByRole('button', { name: 'Antena de haste' });
  await antenna.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('radio', { name: '6' }).focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Confirmar' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: 'Continuar para Montagem de Robôs' })).toBeVisible();

  await page.goto('/#/desafios/casas-de-pombo-1');
  const firstBox = page.getByRole('button', { name: 'Colocar peça na caixa 1' });
  await firstBox.focus();
  for (let item = 0; item < 7; item += 1) await page.keyboard.press('Enter');
  await page.getByRole('radio', { name: '3' }).focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Confirmar' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: 'Continuar para O Armazém no Limite' })).toBeVisible();
});
