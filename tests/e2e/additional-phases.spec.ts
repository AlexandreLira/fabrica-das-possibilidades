import { expect, test } from '@playwright/test';

async function chooseAnswer(page: import('@playwright/test').Page, answer: number) {
  await page.locator('.answer-options label').filter({ hasText: String(answer) }).click();
}

test('o mapa libera as cinco fases de cada um dos três módulos', async ({ page }) => {
  await page.goto('/#/setores');
  await expect(page.locator('.sector-phase a')).toHaveCount(15);
  await expect(page.locator('.sector-phase button:disabled')).toHaveCount(0);
  for (const id of [
    'adicao-2', 'adicao-3', 'adicao-4', 'adicao-5', 'multiplicacao-2', 'multiplicacao-3', 'multiplicacao-4', 'multiplicacao-5',
    'casas-de-pombo-2', 'casas-de-pombo-3', 'casas-de-pombo-4', 'casas-de-pombo-5',
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
  await expect(page.getByRole('link', { name: 'Continuar para A Grande Produção' })).toHaveAttribute('href', '#/desafios/adicao-4');
});

test('A Grande Produção permite tentar novamente e registra a vitória no mapa', async ({ page }) => {
  await page.goto('/#/setores');
  await page.getByRole('link', { name: 'Jogar fase 4 de adição' }).click();
  await expect(page.getByRole('heading', { name: 'A Grande Produção' })).toBeFocused();
  const answer = page.getByRole('radio', { name: '23', exact: true });
  await expect(page.getByText('8 + 6 + 5 + 4 = ?', { exact: true })).toBeVisible();
  await expect(page.getByRole('radio')).toHaveCount(4);
  await expect(answer).toBeDisabled();
  for (const sector of ['mecânico', 'elétrico', 'administrativo', 'logística']) {
    await page.getByRole('button', { name: `Examinar ${sector}` }).click();
  }
  await page.getByRole('button', { name: 'Ver dica' }).click();
  await expect(page.getByText(/Organize os valores/)).toBeVisible();
  await chooseAnswer(page, 21);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('setor administrativo');
  await expect(page.getByRole('radio', { name: '21', exact: true })).not.toBeChecked();
  await chooseAnswer(page, 23);
  await expect(answer).toBeChecked();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('MISSÃO CUMPRIDA!');
  await expect(page.getByRole('status')).toContainText('8 + 6 + 5 + 4 = 23');
  await page.getByRole('button', { name: 'Jogar novamente' }).click();
  await expect(answer).toBeDisabled();
  await page.getByRole('link', { name: /Voltar ao mapa/ }).click();
  await expect(page.getByRole('link', { name: 'Jogar novamente fase 4 de adição' })).toBeVisible();
});

test('Certificação Tripla destaca crachás repetidos e separa as pessoas em sete grupos', async ({ page }) => {
  await page.goto('/#/setores');
  await page.getByRole('link', { name: 'Jogar fase 5 de adição' }).click();
  await expect(page.getByRole('heading', { name: 'Certificação Tripla' })).toBeFocused();
  const correct = page.getByRole('radio', { name: '21', exact: true });
  await expect(correct).toBeDisabled();
  for (const id of ['NR-10', 'NR-12', 'NR-35']) {
    await page.getByRole('button', { name: `Examinar ${id}` }).click();
  }
  const repeated = page.getByRole('button', { name: 'Yara Repetido' });
  await repeated.first().click();
  await expect(page.locator('.certification-list .is-highlighted')).toHaveCount(3);
  await expect(page.getByText('Yara aparece em NR-10, NR-12, NR-35.')).toBeVisible();
  await expect(page.locator('.certification-list').getByText('Afastado', { exact: true })).toHaveCount(3);
  const send = page.getByRole('button', { name: 'Enviar Resposta' });
  const solution = page.getByRole('heading', { name: 'Sete grupos sem repetição' });
  await chooseAnswer(page, 24);
  await send.click();
  await expect(page.getByRole('status')).toContainText('pessoas afastadas');
  await expect(solution).toHaveCount(0);
  await chooseAnswer(page, 19);
  await send.click();
  await expect(page.getByRole('status')).toContainText('descontadas três vezes');
  await expect(solution).toBeVisible();
  await chooseAnswer(page, 21);
  await send.click();
  await expect(page.locator('.certification-group-grid > li')).toHaveCount(7);
  await expect(page.locator('.certification-badges').getByText('Retirado', { exact: true })).toHaveCount(3);
  await expect(page.getByText('24 − 3 = 21')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continuar para Monte o robô' })).toBeVisible();
  await page.getByRole('button', { name: 'Jogar novamente' }).click();
  await expect(correct).toBeDisabled();
  await expect(solution).toHaveCount(0);
});

test('a fase Montagem de Robôs combina corpos e rodas', async ({ page }) => {
  await page.goto('/#/desafios/multiplicacao-2');
  await page.getByRole('group', { name: 'Modelo de corpo' }).getByRole('button', { name: 'Corpo 4' }).click();
  const wheels = page.getByRole('group', { name: 'Modelo de rodas' });
  await expect(wheels.locator('svg')).toHaveCount(3);
  const preview = page.locator('.robot-preview svg');
  await wheels.getByRole('button', { name: 'Rodas 1' }).click();
  await expect(preview.locator('circle[r="11"]')).toHaveCount(2);
  await wheels.getByRole('button', { name: 'Rodas 2' }).click();
  await expect(preview.locator('circle[r="15"]')).toHaveCount(2);
  await wheels.getByRole('button', { name: 'Rodas 3' }).click();
  await expect(preview.locator('circle[r="13"]')).toHaveCount(2);
  await chooseAnswer(page, 12);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('4 × 3 = 12 robôs');
  const combinations = page.getByRole('list', { name: '12 modelos possíveis' });
  await expect(combinations.locator('svg')).toHaveCount(12);
  const firstBody = combinations.getByRole('listitem').filter({ hasText: 'Corpo 1 + Rodas 1' });
  const lastBody = combinations.getByRole('listitem').filter({ hasText: 'Corpo 4 + Rodas 3' });
  await expect(firstBody.locator('svg circle[r="11"]')).toHaveCount(2);
  await expect(lastBody.locator('svg circle[r="13"]')).toHaveCount(2);
});

test('a fase Caminhos da Fábrica conta três etapas', async ({ page }) => {
  await page.goto('/#/desafios/multiplicacao-3');
  for (const stage of ['Setor 1', 'Setor 2', 'Setor 3']) {
    await page.getByRole('group', { name: stage }).getByRole('button').first().click();
  }
  await chooseAnswer(page, 12);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('2 caminhos no primeiro setor, 3 no segundo e 2 no terceiro: 2 × 3 × 2 = 12 trajetos');
  await expect(page.locator('.route-preview svg')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'Continuar para Robô Completo' })).toHaveAttribute('href', '#/desafios/multiplicacao-4');
});

test('Robô Completo combina quatro peças, explica os erros e conclui com 36', async ({ page }) => {
  await page.goto('/#/setores');
  await page.getByRole('link', { name: 'Jogar fase 4 de multiplicação' }).click();
  await expect(page.getByRole('heading', { name: 'Robô Completo' })).toBeFocused();
  const answer = page.getByRole('radio', { name: '36', exact: true });
  const submit = page.getByRole('button', { name: 'Enviar Resposta' });
  await expect(page.locator('.robot-part-thumbnail')).toHaveCount(10);
  const headOptions = page.getByRole('group', { name: 'Cabeça', exact: true });
  await expect(headOptions.getByRole('button', { name: 'Cabeça 3' }).locator('svg rect').first()).toHaveAttribute('rx', '7');
  await expect(page.getByRole('button', { name: 'Sensor 2' }).locator('svg circle')).toHaveCount(2);
  await expect(page.getByRole('radio')).toHaveCount(4);
  for (const part of ['Cabeça 3', 'Corpo 2', 'Braços 2']) {
    await page.getByRole('button', { name: part, exact: true }).click();
  }
  await expect(answer).toBeDisabled();
  await page.getByRole('button', { name: 'Sensor 1', exact: true }).click();
  await page.getByRole('button', { name: 'Sensor 2', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sensor 1', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.robot-parts-summary')).toContainText('Sensor 2');
  await page.getByRole('button', { name: 'Ver dica' }).click();
  await expect(page.getByText(/Cada categoria representa uma etapa/)).toBeVisible();
  for (const [guess, message] of [[10, 'Você somou'], [18, 'quatro categorias'], [24, '18 × 2 = ?']] as const) {
    await chooseAnswer(page, guess);
    await submit.click();
    await expect(page.getByRole('status')).toContainText(message);
  }
  await chooseAnswer(page, 36);
  await submit.click();
  await expect(page.getByText('3 × 3 × 2 × 2 = 36', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('18 × 2 = 36 modelos');
  await expect(page.getByRole('link', { name: 'Continuar para Código do Cofre' })).toBeVisible();
  await page.getByRole('link', { name: /Voltar ao mapa/ }).first().click();
  await expect(page.getByRole('link', { name: 'Jogar novamente fase 4 de multiplicação' })).toBeVisible();
});

test('Código do Cofre valida os algarismos e explica os dois casos', async ({ page }) => {
  await page.goto('/#/setores');
  await page.getByRole('link', { name: 'Jogar fase 5 de multiplicação' }).click();
  await expect(page.getByRole('heading', { name: 'Código do Cofre' })).toBeFocused();
  const correct = page.getByRole('radio', { name: '1.640', exact: true });
  const testCode = page.getByRole('button', { name: 'Testar código' });
  const send = page.getByRole('button', { name: 'Enviar Resposta' });
  const solution = page.getByRole('heading', { name: 'Conte os dois casos' });
  await expect(correct).toBeDisabled();
  for (const key of ['A', '1', '2', '1']) await page.getByRole('button', { name: key, exact: true }).click();
  await testCode.click();
  await expect(page.getByText('Os três algarismos precisam ser diferentes.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Apagar' }).click();
  await page.getByRole('button', { name: '0', exact: true }).click();
  await testCode.click();
  await expect(page.getByText('Código válido. Todas as regras foram atendidas.')).toBeVisible();
  for (const guess of ['1.440', '2.025']) {
    await page.locator('.answer-options label').filter({ hasText: guess }).click();
    await send.click();
    if (guess === '1.440') await expect(solution).toHaveCount(0);
  }
  await expect(solution).toBeVisible();
  await page.locator('.answer-options label').filter({ hasText: '1.640' }).click();
  await send.click();
  await expect(page.getByText('5 × 328 = 1.640', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continuar para Organize o depósito' })).toBeVisible();
  await page.getByRole('button', { name: 'Jogar novamente' }).click();
  await expect(correct).toBeDisabled();
  await expect(solution).toHaveCount(0);
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

test('Operação Linha de Produção diferencia 77 de 78 lotes', async ({ page }) => {
  await page.goto('/#/setores');
  await page.getByRole('link', { name: 'Jogar fase 4 de casas de pombo' }).click();
  await expect(page.getByRole('heading', { name: 'Operação Linha de Produção' })).toBeFocused();
  const answer = page.getByRole('radio', { name: '78', exact: true });
  await expect(answer).toBeDisabled();
  for (let line = 1; line <= 7; line += 1) {
    await page.getByRole('button', { name: new RegExp(`Preencher linha ${line}`) }).click();
  }
  await expect(page.getByText('77 lotes registrados', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ver dica' }).click();
  await expect(page.getByText(/O que aconteceria com o lote seguinte/)).toBeVisible();
  await chooseAnswer(page, 77);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('É preciso considerar mais um lote');
  await chooseAnswer(page, 78);
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByText('7 × (12 − 1) + 1 = 78', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('alguma linha obrigatoriamente fica com pelo menos 12');
  await expect(page.getByRole('link', { name: 'Continuar para Depósito Crítico' })).toHaveAttribute('href', '#/desafios/casas-de-pombo-5');
  await page.getByRole('button', { name: 'Jogar novamente' }).click();
  await expect(page.getByText('0 lotes registrados', { exact: true })).toBeVisible();
  await expect(answer).toBeDisabled();
});

test('Depósito Crítico simula retiradas e distingue 41 de 42 peças', async ({ page }) => {
  await page.goto('/#/setores');
  await page.getByRole('link', { name: 'Jogar fase 5 de casas de pombo' }).click();
  await expect(page.getByRole('heading', { name: 'Depósito Crítico' })).toBeFocused();
  const answer = page.getByRole('radio', { name: '42', exact: true });
  const draw = page.getByRole('button', { name: 'Retirar peça' });
  await expect(page.getByRole('heading', { name: /6 peças azuis, 8 verdes, 12 vermelhas, 12 amarelas e 12 brancas/ })).toBeVisible();
  await page.evaluate(() => { Math.random = () => 0.99; });
  await expect(answer).toBeDisabled();
  await draw.click();
  await expect(page.getByText('1 peça retirada', { exact: true })).toBeVisible();
  await expect(page.locator('.critical-storage .critical-pieces i')).toHaveCount(1);
  for (let i = 1; i < 11; i += 1) await draw.click();
  await expect(page.getByText('Nesta rodada, você chegou a 10 da mesma cor com 10 retiradas. Em outra ordem, pode demorar mais.')).toBeVisible();
  await page.getByRole('button', { name: 'Reiniciar retirada' }).click();
  await expect(page.getByText('0 peças retiradas', { exact: true })).toBeVisible();
  await draw.click();
  const send = page.getByRole('button', { name: 'Enviar Resposta' });
  for (const [guess, message] of [[41, 'ainda é possível'], [46, 'estoque das azuis e das verdes'], [51, 'o máximo por cor é 9']] as const) {
    await chooseAnswer(page, guess);
    await send.click();
    await expect(page.getByRole('status')).toContainText(message);
  }
  await chooseAnswer(page, 42);
  await send.click();
  await expect(page.getByText('42 peças retiradas na demonstração')).toBeVisible();
  await expect(page.locator('.critical-demo-bins .reached-target')).toContainText('Na bandeja: 10');
  await expect(page.getByRole('link', { name: 'Ver resumo final' })).toBeVisible();
  await page.getByRole('button', { name: 'Jogar novamente' }).click();
  await expect(answer).toBeDisabled();
});
