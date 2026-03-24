import prompts from 'prompts';

export async function getDestinationInput(): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'destination',
    message: '여행지를 입력하세요 (예: 교토, 오사카, 파리):',
    validate: (value) => (value.trim().length > 0 ? true : '여행지를 입력해주세요'),
  });

  if (!response.destination) {
    console.log('\n취소되었습니다.');
    process.exit(0);
  }

  return response.destination.trim();
}

export async function confirmContinue(message: string): Promise<boolean> {
  const response = await prompts({
    type: 'confirm',
    name: 'continue',
    message,
    initial: true,
  });

  return response.continue !== false;
}
