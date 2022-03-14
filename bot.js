import 'dotenv/config'
import { Telegraf } from 'telegraf' 

const bot = new Telegraf(process.env.token)


bot.start(content => {
  console.log(content)
  const from = content.update.message.from
  content.reply(`Seja bem vindo, ${from.first_name}`)
})


bot.on('text', (content, next) => {
  console.log(content.update)
  content.reply('uhum......')
  next()
})


bot.telegram.sendMessage('5287311557', 'eU enviei minha primeira mensagem fuck')


bot.startPolling()