// Importações necessárias
const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const fs = require('fs');

// Inicialização do cliente
const client = new Client();

// Função para simular delay
const delay = ms => new Promise(res => setTimeout(res, ms));

// Evento de geração do QR Code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Evento quando o cliente estiver pronto
client.on('ready', async () => {
    console.log('✅ WhatsApp conectado com sucesso!');

    // Obter contatos após o cliente estar pronto
    const contacts = await client.getContacts();
    const contactName = 'Minha Rainha❤️👩🏻';
    const contact = contacts.find(c => c.name === contactName || c.pushname === contactName);

    if (!contact) {
        return console.error(`❌ Contato "${contactName}" não encontrado.`);
    }

    // Enviar uma imagem
    const imagePath = path.join(__dirname, 'Captura de tela_14-2-2025_185723_.jpeg');
    if (!fs.existsSync(imagePath)) {
        return console.error(`❌ Arquivo não encontrado: ${imagePath}`);
    }

    const media = MessageMedia.fromFilePath(imagePath);
    try {
        await client.sendMessage(contact.id._serialized, media, { caption: 'Olá! Não se esqueça dos nossos produtos.' });
        console.log(`📸 Imagem enviada com sucesso para "${contactName}"!`);
    } catch (error) {
        console.error('❌ Erro ao enviar a imagem:', error.message);
    }
});

// Evento para responder mensagens
client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname;

    if (/^(menu|oi|olá|ola|bom dia|boa tarde|boa noite)$/i.test(msg.body)) {
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from,
            `Olá, ${name.split(" ")[0]}! 👋 Sou o assistente virtual da empresa Sollid.\n\nEscolha uma opção:\n\n1️⃣ - Como funciona\n2️⃣ - Valores dos produtos\n3️⃣ - Benefícios de comprar conosco\n4️⃣ - Como aderir\n5️⃣ - Outras perguntas`
        );
    }

    const respostas = {
        '1': 'Nosso serviço oferece atendimento via WhatsApp 6h por dia, 6 dias por semana. Sem carência e com uma ampla gama de benefícios, incluindo acesso a cursos gratuitos.\n\n🔗 *Cadastro:* https://site.com',
        '2': '💲 *Planos disponíveis:*\n- Individual: R$22,50/mês\n- Família (3 dependentes): R$39,90/mês\n- TOP Individual: R$42,50/mês\n- TOP Família: R$79,90/mês\n\n🔗 *Cadastro:* https://site.com',
        '3': '🎁 *Benefícios:*\n- Sorteio anual de prêmios\n- Atendimento médico ilimitado\n- Emissão de receitas\n\n🔗 *Cadastro:* https://site.com',
        '4': '🛠️ *Como aderir:*\nBasta acessar nosso site, escolher o plano desejado e fazer o pagamento. O acesso é imediato.\n\n🔗 *Cadastro:* https://site.com',
        '5': '❓ *Dúvidas?*\nFale diretamente conosco por aqui ou visite nosso site.\n\n🔗 https://site.com'
    };

    if (respostas[msg.body]) {
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, respostas[msg.body]);
    }
});

// Inicializar o cliente
client.initialize();
