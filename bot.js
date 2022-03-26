import 'dotenv/config'
import { Composer, Scenes, session, Telegraf } from 'telegraf'
import {
  buttonsCategorias,
  buttonsProdutos,
  buttonsFinalizarPedido,
  buttonsMenuPrincipal,
  buttonFazerPedido,
  buttonsListaRemoveCarrinho,
  buttonsConfirmaEndereco
} from './buttons.js'
import {
  cardapio,
  produtos,
  btnsMenuPrincipal,
  categorias,
  btnsFinalizarPedido
} from './cardapio.js'

const stepHandler = new Composer()

stepHandler.action(/fazerPedido (.+)/, async (ctx) => {
  await ctx.reply('O que deseja?', buttonsCategorias(categorias))
})


stepHandler.action(/verCardapio (.+)/, async (ctx) => {
  await ctx.reply(`${cardapio}`, buttonFazerPedido())
})

stepHandler.action(/adicionaCategoria (.+)/, async (ctx) => {
  const categoriaProduto = ctx.match[1]
  await ctx.reply('Certo, agora selecione um item para colocar em seu carrinho', buttonsProdutos(produtos[`${categoriaProduto}`]))  
})


stepHandler.action(/adicionaCarrinho (.+)/, async (ctx) => {
  ctx.wizard.state.totalPedido = 0
  ctx.wizard.state.pedidosApresentaCarrinho = ''
  ctx.wizard.state.dadosPedido = ctx.match[1].split(' ')
  ctx.wizard.state.posicaoPreco = ctx.wizard.state.dadosPedido.findIndex(preco => preco === 'Preco')
  ctx.wizard.state.montaNomeProduto = ''
  for(let i = 0; i < ctx.wizard.state.posicaoPreco; i++) {
    ctx.wizard.state.montaNomeProduto = `${ctx.wizard.state.montaNomeProduto}` +  ' ' + `${ctx.wizard.state.dadosPedido[i]}`
  }

  ctx.wizard.state.pedidoCliente = {
    produto: ctx.wizard.state.montaNomeProduto,
    preco: parseInt(ctx.wizard.state.dadosPedido[ctx.wizard.state.posicaoPreco + 1]),
    qnt: 1
  }

  if(ctx.wizard.state.carrinho.length == 0) {
    ctx.wizard.state.pedidoCliente.qnt = 1
    ctx.wizard.state.carrinho = []
    ctx.wizard.state.carrinho.push(ctx.wizard.state.pedidoCliente)
  } 
  else {
    ctx.wizard.state.temNoArray = ctx.wizard.state.carrinho.findIndex(item => item.produto === ctx.wizard.state.pedidoCliente.produto) 
    if(ctx.wizard.state.temNoArray < 0) ctx.wizard.state.carrinho.push(ctx.wizard.state.pedidoCliente)
    else ctx.wizard.state.carrinho[ctx.wizard.state.temNoArray].qnt = ctx.wizard.state.carrinho[ctx.wizard.state.temNoArray].qnt + 1 
  }
  ctx.wizard.state.carrinho.map(item => {
    ctx.wizard.state.pedidosApresentaCarrinho = `${ctx.wizard.state.pedidosApresentaCarrinho} \n ${item.produto} - Quantidade: ${item.qnt}x \n `
  })  
  await ctx.reply(`Confira seu carrinho \n\n ${ctx.wizard.state.pedidosApresentaCarrinho} `)
  ctx.wizard.state.carrinho.forEach(item => {
    ctx.wizard.state.totalPorProduto = item.preco * item.qnt
    ctx.wizard.state.totalPedido = ctx.wizard.state.totalPedido + ctx.wizard.state.totalPorProduto
  })
  await ctx.reply(`Total pedido: R$${ctx.wizard.state.totalPedido}`, buttonsFinalizarPedido(btnsFinalizarPedido))
  ctx.wizard.state.pedidosApresentaCarrinho = ''
})


stepHandler.action(/Adicionar (.+)/, async (ctx) => {
  ctx.wizard.state.totalPedido = 0
  await ctx.reply('Certo, agora selecione um item para colocar em seu carrinho', buttonsCategorias(categorias))
})

stepHandler.action(/Remover (.+)/, async (ctx) => {
  await ctx.reply('Certo, agora selecione um item para remover do carrinho', buttonsListaRemoveCarrinho(ctx.wizard.state.carrinho))
})


stepHandler.action(/removeItem (.+)/, async (ctx) => {
  ctx.wizard.state.totalPedido = 0
  ctx.wizard.state.newArrCarrinho = ctx.wizard.state.carrinho.filter(item => {
    if(item.produto !== ctx.match[1]) return item
  })
  ctx.wizard.state.carrinho.length = 0
  ctx.wizard.state.newArrCarrinho.map(item => {
    ctx.wizard.state.carrinho.push(item)
    ctx.wizard.state.pedidosApresentaCarrinho = `${ctx.wizard.state.pedidosApresentaCarrinho} \n ${item.produto} - Quantidade: ${item.qnt}x \n `
  })
  if(ctx.wizard.state.carrinho.length == 0)
    await ctx.reply('\n\nCarrinho vazio!\n\n')
  else
    await ctx.reply(`Confira seu carrinho \n\n ${ctx.wizard.state.pedidosApresentaCarrinho} `)
  ctx.wizard.state.newArrCarrinho.forEach(item => {
    ctx.wizard.state.totalPorProduto = item.preco * item.qnt
    ctx.wizard.state.totalPedido = ctx.wizard.state.totalPedido + ctx.wizard.state.totalPorProduto
  })
  await ctx.reply(`Total pedido: R$${ctx.wizard.state.totalPedido}`, buttonsFinalizarPedido(btnsFinalizarPedido))
  ctx.wizard.state.pedidosApresentaCarrinho = ''
})

stepHandler.action(/Finalizar (.+)/, async (ctx) => {
    await ctx.reply('Digite seu endereço ou envie sua localização, exemplo: Rua Alziro Zarur 10-35')
    return ctx.wizard.next()
})

stepHandler.action(/confirmaEndereco (.+)/, async (ctx) => {
  console.log(ctx.wizard.state)
  //aqui mandar pro dashboard da loja 
	await ctx.reply('Certo! Seu pedido foi anotado com sucesso!\n\n Obrigado por utilizar essa ferramenta para realizar seu pedido.')
  ctx.scene.leave()
})

stepHandler.action(/naoConfirmaEndereco (.+)/, async (ctx) => {
	await ctx.reply('Digite seu endereço ou envie sua localização')
  return ctx.wizard.next()
})



stepHandler.use((ctx) => {
	ctx.replyWithMarkdown('Por favor selecione usando o botão')
})


const stepsPedido = new Scenes.WizardScene(
	'pedido',
	async (ctx) => {
    const name = ctx.update.message.from.first_name
    ctx.wizard.state.carrinho = []
    await ctx.reply(`Seja bem vindo, ${name}`, buttonsMenuPrincipal(btnsMenuPrincipal))
		ctx.wizard.state.pedido = []
		return ctx.wizard.next()
	},
	stepHandler,
	async (ctx) => {
    ctx.wizard.state.endereco = ctx.update.message.text
    await ctx.reply(`O endereço: ${ctx.update.message.text} está correto?`, buttonsConfirmaEndereco())
    return ctx.wizard.next()
	},
  stepHandler,
  async (ctx) => {
    ctx.wizard.state.endereco = ctx.update.message.text
    await ctx.reply(`O endereço: ${ctx.update.message.text} está correto?`, buttonsConfirmaEndereco())
    return ctx.wizard.next()
	},
  stepHandler
)



const bot = new Telegraf(process.env.token)
const stage = new Scenes.Stage([stepsPedido], {
	default: 'pedido'
})
bot.use(session())
bot.use(stage.middleware())

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
