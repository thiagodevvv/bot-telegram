const cardapio = 'Cardápio \n\n\n Lanches \n\n X-SALADA R$ 10,00\n pão, muita salada, hamburguer de 1kg e um queijo light\n\n X-BACON R$ 15,00\n pão, baconzito sequinho, hamburguer de 1kg \n\n X-TUDO R$25,00 \n pão, arroz,feijão, ovo, hamburger, salada e um marmitex\n\n\n Bebidas \n\n Coca 1L RS 5,00\n Coca 2L RS 10,00\n Suco 600ML R$50,00\n\n\n Porções \n\n Franguinho RS$ 100,00 \n Tilápinha  RS 200,00 \n Fritas R$ 20,00\n\n'
const produtos = {
  "Lanches": [{titleProduto: 'X-SALADA COMPLETO', categoria: 'Lanches', preco: 10}, {titleProduto: 'X-BACON', categoria: 'produto', preco: 15}, {titleProduto: 'X-TUDO', categoria: 'produto', preco: 25}, {system: 'voltar', titleProduto: 'Voltar Menu Principal'}],
  "Bebidas": [{titleProduto: 'COCA COLA 1L', categoria: 'Bebidas', preco: 5}, {titleProduto: 'COCA COLA 2L', categoria: 'Bebidas', preco: 10}, {titleProduto: 'Suco 600ML', categoria: 'Bebidas', preco: 50}, {system: 'voltar', titleProduto: 'Voltar Menu Principal'}]
}
const btnsMenuPrincipal = ["Ver Cardápio", "Fazer Pedido"]
const categorias = ['Lanches', 'Bebidas', 'Porções']
const btnsFinalizarPedido = ['Adicionar mais item','Finalizar Pedido', 'Remover item']



export {
  cardapio,
  produtos,
  btnsMenuPrincipal,
  categorias,
  btnsFinalizarPedido
}