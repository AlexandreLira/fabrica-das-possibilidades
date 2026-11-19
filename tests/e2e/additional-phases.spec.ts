import { expect, test } from '@playwright/test';

async function chooseAnswer(page: import('@playwright/test').Page, answer: number) {
  await page.locator('.answer-options label').filter({ hasText: String(answer) }).click();
}

test('o mapa libera nove fases e mantém seis vagas futuras indisponíveis', async ({ page }) => {
  await page.goto('/#/setores');
  await expect(page.locator('.sector-phase a')).toHaveCount(9);
  await expect(page.locator('.sector-phase button:disabled')).toHaveCount(6);
  for (const id of [
    'adicao-2', 'adicao-3', 'multiplicacao-2', 'multiplicacao-3',
    'casas-de-pombo-2', 'casas-de-pombo-3',
  ]) {
    await expect(page.locator(`.sector-phase a[href="#/desafios/${id}"]`)).toBeVisible();
  }
});

test('a fase Separação de Produtos soma os dois grupos', async ({ page }) => {
  await page.goto('/#/desafios/adicao-2');
  await page.getByRole('button', { name: /Examinar produtos vermelhos/ }).click();
  await page.getByRole('button', { name: /Examinar produtos azuis/ }).click();
  await chooseAnswer(page, 7);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('4 produtos vermelhos + 3 produtos azuis = 7 opções');
  await expect(page.getByRole('link', { name: /Continuar para Escolha de Materiais/ })).toBeVisible();
});

test('a fase Escolha de Materiais soma três grupos', async ({ page }) => {
  await page.goto('/#/desafios/adicao-3');
  for (const group of ['Ferramentas', 'Peças metálicas', 'Componentes eletrônicos']) {
    await page.getByRole('button', { name: new RegExp(`Examinar ${group}`, 'i') }).click();
  }
  await chooseAnswer(page, 12);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('5 ferramentas + 4 peças metálicas + 3 componentes eletrônicos = 12 opções');
});

test('a fase Montagem de Robôs combina corpos e rodas', async ({ page }) => {
  await page.goto('/#/desafios/multiplicacao-2');
  await page.getByRole('group', { name: 'Modelo de corpo' }).getByRole('button', { name: 'Corpo 4' }).click();
  await page.getByRole('group', { name: 'Modelo de rodas' }).getByRole('button', { name: 'Rodas 3' }).click();
  await chooseAnswer(page, 12);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('4 × 3 = 12 robôs');
});

test('a fase Caminhos da Fábrica conta três etapas', async ({ page }) => {
  await page.goto('/#/desafios/multiplicacao-3');
  for (const stage of ['Setor 1', 'Setor 2', 'Setor 3']) {
    await page.getByRole('group', { name: stage }).getByRole('button').first().click();
  }
  await chooseAnswer(page, 12);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('2 caminhos no primeiro setor, 3 no segundo e 2 no terceiro: 2 × 3 × 2 = 12 trajetos');
});

test('a fase O Armazém no Limite distribui treze caixas em cinco compartimentos', async ({ page }) => {
  await page.goto('/#/desafios/casas-de-pombo-2');
  const firstBox = page.getByRole('button', { name: /Colocar caixa no compartimento 1/ });
  for (let count = 0; count < 13; count += 1) await firstBox.click();
  await chooseAnswer(page, 3);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('Cinco compartimentos com 2 caixas acomodam 10');
});

test('a fase Controle de Qualidade distribui 31 componentes em seis categorias', async ({ page }) => {
  await page.goto('/#/desafios/casas-de-pombo-3');
  const categories = ['Elétrico', 'Mecânico', 'Acabamento', 'Conexão', 'Montagem', 'Isolamento'];
  for (let count = 0; count < 31; count += 1) {
    const category = categories[count % categories.length];
    await page.getByRole('button', { name: new RegExp(`Colocar componente na categoria ${category}`) }).click();
  }
  await chooseAnswer(page, 6);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('Seis categorias com 5 componentes acomodam 30');
});
