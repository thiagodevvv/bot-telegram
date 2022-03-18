import { Markup } from 'telegraf' 

const btnFazerPedido = ["Fazer Pedido"]

const buttonsCategorias = (categorias) => Markup.inlineKeyboard(
  categorias.map(item => Markup.button.callback(`${item}`, `adicionaCategoria ${item}`)),
  {
    columns: 1
  }
)

const buttonsProdutos = (produtos) => Markup.inlineKeyboard(
  produtos.map(item => Markup.button.callback(`${item.titleProduto}`, `${item.system ? 'Voltar': 'adicionaCarrinho '} ${item.titleProduto} Preco ${item.preco}`)),
  {
    columns: 1
  }
)


const buttonsFinalizarPedido = (btnsFinalizar) => Markup.inlineKeyboard(
  btnsFinalizar.map(item => Markup.button.callback(`${item}`, `${item}`)),
  {
    columns: 1
  }
)


const buttonFazerPedido = () => Markup.inlineKeyboard(
  btnFazerPedido.map(btn => Markup.button.callback(`${btn}`, `fazerPedido ${btn}`)),
  {
    columns: 1
  }
)


const buttonsMenuPrincipal = (btnsPrincipal) => Markup.inlineKeyboard(
  btnsPrincipal.map(btn => Markup.button.callback(`${btn}`, `${btn === 'Fazer Pedido' ? 'fazerPedido' : 'verCardapio'} ${btn}`)),
  {
    columns: 1
  }
)


const buttonsListaRemoveCarrinho = (listaCarrinho) => Markup.inlineKeyboard(
  listaCarrinho.map(item => Markup.button.callback(`${item.produto}`, `removeItem ${item.produto}`)),
  {
    columns: 1
  }
)
export {
  buttonsCategorias,
  buttonsProdutos,
  buttonsFinalizarPedido,
  buttonsMenuPrincipal,
  buttonFazerPedido,
  buttonsListaRemoveCarrinho
}