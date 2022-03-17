import { Markup } from 'telegraf' 

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

const buttonsMenuPrincipal = (btnsPrincipal) => Markup.inlineKeyboard(
  btnsPrincipal.map(btn => Markup.button.callback(`${btn}`, `fazerPedido ${btn}`)),
  {
    columns: 1
  }
)
export {
  buttonsCategorias,
  buttonsProdutos,
  buttonsFinalizarPedido,
  buttonsMenuPrincipal
}