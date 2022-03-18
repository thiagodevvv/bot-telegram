import 'dotenv/config'
import { Telegraf } from 'telegraf'
import {
  buttonsCategorias,
  buttonsProdutos,
  buttonsFinalizarPedido,
  buttonsMenuPrincipal,
  buttonFazerPedido,
  buttonsListaRemoveCarrinho
} from './buttons.js'
import {
  cardapio,
  produtos,
  btnsMenuPrincipal,
  categorias,
  btnsFinalizarPedido
} from './cardapio.js'

const bot = new Telegraf(process.env.token)

const carrinho =  []
let pedidosApresentaCarrinho = ''
let totalPedido = 0


bot.start(async ctx => {
  totalPedido = 0
  carrinho.length = 0
  const name = ctx.update.message.from.first_name
  await ctx.reply(`Seja bem vindo, ${name}`, buttonsMenuPrincipal(btnsMenuPrincipal))
})

bot.action(/fazerPedido (.+)/, async (ctx, next) => {
  totalPedido = 0
  await ctx.reply('O que deseja?', buttonsCategorias(categorias))
})

bot.action(/verCardapio (.+)/, async (ctx, next) => {
  await ctx.reply(`${cardapio}`, buttonFazerPedido())
})

bot.action(/Voltar (.+)/, async (ctx, next) => {
  await ctx.reply('Selecione a categoria que deseja', buttonsCategorias(categorias))
})

bot.action(/adicionaCategoria (.+)/, async (ctx, next) => {
  const categoriaProduto = ctx.match[1]
  await ctx.reply('Certo, agora selecione um item para colocar em seu carrinho', buttonsProdutos(produtos[`${categoriaProduto}`]))
  next()
  
})

bot.action(/adicionaCarrinho (.+)/, async (ctx, next) => {
  totalPedido = 0
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
  await ctx.reply('Certo, agora selecione um item para colocar em seu carrinho', buttonsCategorias(categorias))
})

bot.action(/Remover (.+)/, async (ctx, next) => {
  await ctx.reply('Certo, agora selecione um item para remover do carrinho', buttonsListaRemoveCarrinho(carrinho))
})


bot.action(/removeItem (.+)/, async (ctx, next) => {
  totalPedido = 0
  const newArrCarrinho = carrinho.filter(item => {
    if(item.produto !== ctx.match[1]) return item
  })
  carrinho.length = 0
  newArrCarrinho.map(item => {
    carrinho.push(item)
    pedidosApresentaCarrinho = `${pedidosApresentaCarrinho} \n ${item.produto} - Quantidade: ${item.qnt}x \n `
  })  
  await ctx.reply(`Confira seu carrinho \n\n ${pedidosApresentaCarrinho} `)
  newArrCarrinho.forEach(item => {
    const totalPorProduto = item.preco * item.qnt
    totalPedido = totalPedido + totalPorProduto
  })
  await ctx.reply(`Total pedido: R$${totalPedido}`, buttonsFinalizarPedido(btnsFinalizarPedido))
  pedidosApresentaCarrinho = ''
})

bot.action(/Finalizar (.+)/, async (ctx, next) => {
    console.log('finalizando.....')
})

bot.startPolling()