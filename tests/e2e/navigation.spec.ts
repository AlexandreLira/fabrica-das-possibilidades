import { expect, test } from '@playwright/test';

test('navega, lembra o som e mantém apenas um canvas após reentradas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Fábrica das Possibilidades' })).toBeVisible();
  await page.getByRole('button', { name: 'Silenciar efeitos sonoros' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Ativar efeitos sonoros' })).toBeVisible();
  await page.getByRole('link', { name: 'Como jogar' }).click();
  await page.getByRole('button', { name: 'Entendi, vamos lá' }).click();
  await expect(page.getByRole('heading', { name: 'Conheça os setores' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cumprimentar B.O.T.' })).toBeEnabled();
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.getByRole('button', { name: 'Cumprimentar B.O.T.' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Tudo pronto' })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Começar' }).click();
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Fábrica das Possibilidades' })).toBeVisible();
});

test('joga a fase de adição com dica, tentativas e conclusão', async ({ page }) => {
  await page.goto('/#/setores');
  await page.getByRole('link', { name: 'Jogar fase de Adição' }).click();
  await expect(page.getByRole('heading', { name: 'Pedido com rota alternativa' })).toBeFocused();

  const answerSeven = page.getByRole('radio', { name: '7' });
  await expect(answerSeven).toBeDisabled();
  await page.getByRole('button', { name: /Examinar rota local/ }).click();
  await expect(answerSeven).toBeDisabled();
  await page.getByRole('button', { name: /Examinar rota expressa/ }).click();
  await expect(answerSeven).toBeEnabled();

  const hintButton = page.getByRole('button', { name: 'Ver dica' });
  await expect(hintButton).toHaveAttribute('aria-expanded', 'false');
  await hintButton.click();
  await expect(hintButton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText(/Conte as opções de um grupo/)).toBeVisible();

  await page.locator('.answer-options label').filter({ hasText: '12' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('Multiplicar contaria');
  await expect(page.getByRole('radio', { name: '12' })).not.toBeChecked();

  await page.locator('.answer-options label').filter({ hasText: '6' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('Confira os dois grupos');

  await page.locator('.answer-options label').filter({ hasText: '7' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('3 + 4 = 7 possibilidades');
  await expect(page.getByRole('radio', { name: '12' })).toBeDisabled();
  await page.getByRole('link', { name: 'Continuar para Multiplicação' }).click();
  await expect(page.getByRole('heading', { name: 'Monte o robô' })).toBeFocused();
});

test('mantém um único canvas da fase após sair e reentrar', async ({ page }) => {
  await page.goto('/#/desafios/adicao-1');
  await expect(page.locator('.challenge-game canvas')).toHaveCount(1);
  await page.getByRole('link', { name: 'Voltar ao mapa' }).click();
  await expect(page.locator('.challenge-game canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Jogar fase de Adição' }).click();
  await expect(page.locator('.challenge-game canvas')).toHaveCount(1);
});

test('conclui a fase usando somente o teclado', async ({ page, browserName }) => {
  await page.goto('/#/desafios/adicao-1');
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  const local = page.getByRole('button', { name: /Examinar rota local/ });
  const express = page.getByRole('button', { name: /Examinar rota expressa/ });
  await expect(page.getByRole('heading', { name: 'Pedido com rota alternativa' })).toBeFocused();
  await page.getByRole('link', { name: 'Pular para o conteúdo' }).focus();
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.keyboard.press(tab);
  await expect(page.getByRole('link', { name: 'Voltar ao mapa' })).toBeFocused();
  await page.keyboard.press(tab);
  await expect(page.getByRole('button', { name: 'Ocultar tutorial' })).toBeFocused();
  await page.keyboard.press(tab);
  await expect(local).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press(tab);
  await expect(express).toBeFocused();
  await page.keyboard.press('Enter');
  const answer = page.getByRole('radio', { name: '7' });
  await page.keyboard.press(tab);
  await page.keyboard.press('ArrowRight');
  await expect(answer).toBeFocused();
  await expect(answer.locator('..')).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Space');
  await page.keyboard.press(tab);
  await page.keyboard.press(tab);
  await expect(page.getByRole('button', { name: 'Confirmar' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: 'Continuar para Multiplicação' })).toBeVisible();
});

for (const width of [320, 390]) {
  test(`layout sem transbordamento com ${width}px e movimento reduzido`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const hash of ['', '#/instrucoes', '#/setores', '#/desafios/adicao-1']) {
      await page.goto(`/${hash}`);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.screenshot({ path: `test-results/setores-${width}-${test.info().project.name}.png`, fullPage: true });
  });
}


test('teclado alcança controles e a rota recebe foco', async ({ page, browserName }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.getByRole('link', { name: 'Pular para o conteúdo' }).focus();
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  await page.keyboard.press(tab);
  await expect(page.getByRole('button', { name: 'Silenciar efeitos sonoros' })).toBeFocused();
  await page.getByRole('link', { name: 'Como jogar' }).click();
  await expect(page.locator('h1')).toBeFocused();
});

test('a aplicação e o motor ficam disponíveis offline após o primeiro carregamento', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Fábrica das Possibilidades');
  await page.getByRole('link', { name: 'Começar' }).click();
  await expect(page.getByRole('button', { name: 'Cumprimentar B.O.T.' })).toBeEnabled();
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.getByRole('link', { name: 'Jogar fase de Adição' }).click();
  await expect(page.getByRole('heading', { name: 'Pedido com rota alternativa' })).toBeVisible();
  await expect(page.locator('.challenge-game canvas')).toHaveCount(1);
});

test('pular para o conteúdo mantém a tela atual', async ({ page }) => {
  await page.goto('/#/instrucoes');
  await page.getByRole('link', { name: 'Pular para o conteúdo' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page).toHaveURL(/#\/instrucoes$/);
});

test.describe('falhas sem interferência do cache offline', () => {
  test.use({ serviceWorkers: 'block' });
test('falha no carregamento do motor preserva navegação e conteúdo', async ({ page }) => {
  await page.route(/.*\/assets\/.*(?:engine|phaser).*\.js$/, route => route.abort());
  await page.goto('/#/setores');
  await expect(page.getByText('A apresentação animada está indisponível.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Princípio da Adição' })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(page.locator('h1')).toHaveText('Fábrica das Possibilidades');
});
test('falha do sprite usa a alternativa estática e não habilita a cena', async ({ page }) => {
  await page.route(/.*\/assets\/bot-.*\.svg$/, route => route.abort());
  await page.goto('/#/setores');
  await expect(page.getByText('A apresentação animada está indisponível.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cumprimentar B.O.T.' })).toBeDisabled();
  await expect(page.locator('.game-fallback img')).toBeVisible();
});

test('falha do Phaser mantém a fase jogável com representação estática', async ({ page }) => {
  await page.route(/.*\/assets\/.*(?:challengeEngine|phaser).*\.js$/, route => route.abort());
  await page.goto('/#/desafios/adicao-1');
  await expect(page.getByText('A animação da fábrica está indisponível.')).toBeVisible();
  await expect(page.locator('.challenge-static')).toBeVisible();
  await page.getByRole('button', { name: /Examinar rota local/ }).click();
  await page.getByRole('button', { name: /Examinar rota expressa/ }).click();
  await page.locator('.answer-options label').filter({ hasText: '7' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('link', { name: 'Continuar para Multiplicação' })).toBeVisible();
});

});
