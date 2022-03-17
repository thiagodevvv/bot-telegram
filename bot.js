import 'dotenv/config'
import { Telegraf } from 'telegraf'
import {
  buttonsCategorias,
  buttonsProdutos,
  buttonsFinalizarPedido,
  buttonsMenuPrincipal
} from './buttons.js'

const bot = new Telegraf(process.env.token)

const produtos = [{titleProduto: 'X-SALADA COMPLETO', categoria: 'Lanches', preco: 10}, {titleProduto: 'X-BACON', categoria: 'produto', preco: 15}, {titleProduto: 'X-TUDO', categoria: 'produto', preco: 25}, {system: 'voltar', titleProduto: 'Voltar Menu Principal'}]
const btnsMenuPrincipal = ["Ver Cardápio", "Fazer Pedido"]
const categorias = ['Lanches', 'Bebidas', 'Porções']
const btnsFinalizarPedido = ['Adicionar mais item','Finalizar Pedido', 'Remover item']

const carrinho =  []

let pedidosApresentaCarrinho = ''
let totalPedido = 0



bot.start(async ctx => {
  const from = ctx.update.message.from
  await ctx.reply(`Seja bem vindo, ${from.first_name}`, buttonsMenuPrincipal(btnsMenuPrincipal))
})

bot.action(/fazerPedido (.+)/, async (ctx, next) => {
  await ctx.reply('O que deseja?', buttonsCategorias(categorias))
})
bot.action(/Voltar (.+)/, async (ctx, next) => {
  await ctx.reply('Selecione a categoria que deseja', buttonsCategorias(categorias))
})

bot.action(/adicionaCategoria (.+)/, async (ctx, next) => {
  // pedidoCliente.categoria = ctx.match[1]
  await ctx.reply('Certo, agora selecione um item para colocar em seu carrinho', buttonsProdutos(produtos))
  next()
  
})


bot.action(/adicionaCarrinho (.+)/, async (ctx, next) => {
  const dadosPedido = ctx.match[1].split(' ')
  const posicaoPreco = dadosPedido.findIndex(preco => preco === 'Preco')
  let montaNomeProduto = ''
  for(let i = 0; i < posicaoPreco; i++) {
    montaNomeProduto = `${montaNomeProduto}` +  ' ' + `${dadosPedido[i]}`
  }
  const pedidoCliente = {
    produto: montaNomeProduto,
    preco: parseInt(dadosPedido[posicaoPreco + 1]),
    qnt: 1
  }

  if(carrinho.length == 0) {
    pedidoCliente.qnt = 1
    carrinho.push(pedidoCliente)
  } 
  else {
    const temNoArray  =  carrinho.findIndex(item => item.produto === pedidoCliente.produto) 
    if(temNoArray < 0) carrinho.push(pedidoCliente)
    else carrinho[temNoArray].qnt = carrinho[temNoArray].qnt + 1 
  }
  carrinho.map(item => {
    pedidosApresentaCarrinho = `${pedidosApresentaCarrinho} \n ${item.produto} - Quantidade: ${item.qnt}x \n `
  })  
  await ctx.reply(`Confira seu carrinho \n\n ${pedidosApresentaCarrinho} `)
  carrinho.forEach(item => {
    const totalPorProduto = item.preco * item.qnt
    totalPedido = totalPedido + totalPorProduto
  })
  await ctx.reply(`Total pedido: R$${totalPedido}`, buttonsFinalizarPedido(btnsFinalizarPedido))
  pedidosApresentaCarrinho = ''
})


bot.action(/Adicionar (.+)/, async (ctx, next) => {
  totalPedido = 0
  await ctx.reply('Certo, agora selecione um item para colocar em seu carrinho', buttonsProdutos(produtos))
})




// bot.telegram.sendMessage('5287311557', 'eU enviei minha primeira mensagem fuck')
// bot.telegram.sendMessage('-775608967', "olá grupo")

bot.startPolling()