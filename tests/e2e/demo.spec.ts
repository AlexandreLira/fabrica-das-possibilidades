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

test('mapa oferece uma fase funcional em cada setor', async ({ page }) => {
  await page.goto('/#/setores');
  await expect(page.getByRole('link', { name: 'Jogar fase de Adição' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Jogar fase de Multiplicação' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Jogar fase de Casas de Pombo' })).toBeVisible();
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
  await expect(page.getByRole('list', { name: 'Seis modelos possíveis' }).getByRole('listitem')).toHaveCount(6);

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

test('conclui a sequência e mostra o resumo dos três princípios', async ({ page }) => {
  await page.goto('/#/desafios/adicao-1');
  await completeAddition(page);
  await page.getByRole('link', { name: 'Continuar para Multiplicação' }).click();
  await completeMultiplication(page);
  await page.getByRole('link', { name: 'Continuar para Casas de Pombo' }).click();
  await distribute322(page);
  await page.locator('.answer-options label').filter({ hasText: '3' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.getByRole('link', { name: 'Ver resumo final' }).click();

  await expect(page.getByRole('heading', { name: 'Fábrica em funcionamento!' })).toBeFocused();
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
  await expect(page.getByRole('link', { name: 'Continuar para Casas de Pombo' })).toBeVisible();

  await page.goto('/#/desafios/casas-de-pombo-1');
  await expect(page.getByText('A animação da fábrica está indisponível.')).toBeVisible();
  await distribute322(page);
  await page.locator('.answer-options label').filter({ hasText: '3' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('link', { name: 'Ver resumo final' })).toBeVisible();
});

for (const width of [320, 390]) {
  test(`mantém todas as fases sem rolagem horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of ['adicao-1', 'multiplicacao-1', 'casas-de-pombo-1']) {
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
  await expect(page.getByRole('link', { name: 'Continuar para Casas de Pombo' })).toBeVisible();

  await page.goto('/#/desafios/casas-de-pombo-1');
  const firstBox = page.getByRole('button', { name: 'Colocar peça na caixa 1' });
  await firstBox.focus();
  for (let item = 0; item < 7; item += 1) await page.keyboard.press('Enter');
  await page.getByRole('radio', { name: '3' }).focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Confirmar' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: 'Ver resumo final' })).toBeVisible();
});
