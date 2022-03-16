import 'dotenv/config'
import { Telegraf, Markup } from 'telegraf' 

const bot = new Telegraf(process.env.token)
const userPedido = []

const produtos = [{titleProduto: "X-SALADA", categoria: 'Lanches', preco: 10}, {titleProduto: "X-BACON", categoria: 'produto', preco: 15}, {titleProduto: "X-TUDO", categoria: 'produto', preco: 25}]
const categorias = ["Lanches", "Bebidas", "Porções"]

const carrinho =  []

const pedidoCliente = {
  categoria: '',
  produto: '',
  preco: 0
}

const buttonsCategorias = (categorias) => Markup.inlineKeyboard(
  categorias.map(item => Markup.button.callback(`${item}`, `adicionaCategoria ${item}`)),
  {
    columns: 1
  }
)

const buttonsProdutos = (produtos) => Markup.inlineKeyboard(
  produtos.map(item => Markup.button.callback(`${item.titleProduto}`, `adicionaCarrinho ${item.titleProduto} Preco ${item.preco}`)),
  {
    columns: 1
  }
)



bot.start(async ctx => {
  const from = ctx.update.message.from
  await ctx.reply(`Seja bem vindo, ${from.first_name}`)
  await ctx.reply('O que deseja?', buttonsCategorias(categorias))
})


bot.action(/adicionaCategoria (.+)/, async (ctx, next) => {
  pedidoCliente.categoria = ctx.match[1]
  await ctx.reply('Certo, agora selecione um item para colocar em seu carrinho', buttonsProdutos(produtos))
  next()
  
})


bot.action(/adicionaCarrinho (.+)/, async (ctx, next) => {
 const dadosPedido = ctx.match[1].split(' ')
  pedidoCliente.produto = dadosPedido[0]
  pedidoCliente.preco = parseInt(dadosPedido[2])
  console.log(pedidoCliente)
  next()
  
})

bot.on('text', (ctx, next) => {
  console.log(ctx)
  const pedido = ctx.update.message.text
  // const response = findAnswer(msg)
  userPedido.push(pedido)
  ctx.reply(`${pedido} Adicionado ao carrinho.`)
  next()
})

// bot.telegram.sendMessage('5287311557', 'eU enviei minha primeira mensagem fuck')
// bot.telegram.sendMessage('-775608967', "olá grupo")

bot.startPolling()