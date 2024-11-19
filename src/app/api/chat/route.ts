import { Configuration, OpenAIApi } from 'openai-edge'; 
import { OpenAIStream, StreamingTextResponse } from 'ai';

// const chaveapi = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
// const teste = process.env.TESTE;
// console.log(chaveapi);
// console.log(teste);

// Verificar se a chave da API está definida
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

// Criar o cliente da API do OpenAI (compatível com edge)
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });  

const openai = new OpenAIApi(config);

export const runtime = 'edge';

export async function POST(req: Request) {
  let messages;

  try {
    // Extrair as mensagens do corpo da requisição
    const body = await req.json();
    messages = body.messages;

    // Validar se "messages" é um array e não vazio
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid input: "messages" should be a non-empty array', { status: 400 });
    }

    console.log('Mensagem recebida:', messages);
  } catch (error: unknown) {
    // Capturar e retornar erros de leitura do corpo da requisição
    if (error instanceof Error) {
      console.error('Erro ao parsear o corpo da requisição:', error.message);
      return new Response('Error parsing the request body. Ensure the input is valid JSON and contains "messages".', { status: 400 });
    } else {
      console.error('Erro desconhecido ao parsear a requisição:', error);
      return new Response('Unknown error occurred during request parsing.', { status: 400 });
    }
  }

  try {
    console.log('Iniciando a chamada à API do OpenAI...');
    // Solicitar ao OpenAI uma conclusão de chat com streaming
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
    });

    // Converter a resposta em um stream de texto amigável
    const stream = OpenAIStream(response);

    // Responder com o stream de texto
    return new StreamingTextResponse(stream);
  } catch (error: unknown) {
    // Capturar e retornar erros da API do OpenAI
    if (error instanceof Error) {
      console.error('Erro na chamada da API OpenAI:', error.message);
      return new Response('Error occurred while calling OpenAI API. Please try again later.', { status: 500 });
    } else {
      console.error('Erro desconhecido ao chamar a API OpenAI:', error);
      return new Response('Unknown error occurred while calling OpenAI API.', { status: 500 });
    }
  }
}
