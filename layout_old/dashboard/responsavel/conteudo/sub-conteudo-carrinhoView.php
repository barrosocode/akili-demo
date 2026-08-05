<div class="row">
    <div class="col-sm-12 mb-5" style="text-align:right;">
        <a href="<?php echo WWW; ?>dashboard" class="vs-btn"><i class="fa fa-plus"></i> ADICIONAR MAIS PACOTES AO CARRINHO</a>
    </div>
</div>
<?php if ($showDetalhesCarrinho) { ?>
    <form action="#" class="woocommerce-cart-form">
        <?php echo $showDetalhesCarrinho; ?>
    </form>
<?php } ?>
<?php if (isset($dados_pacote['alunos']) && is_array($dados_pacote['alunos']) && sizeof($dados_pacote['alunos']) > 0) { ?>
    <?php if (isset($mensagemErroCupom)) { ?>
        <div class="alert alert-danger mb-5" role="alert">
            <?php echo $mensagemErroCupom; ?>
        </div>
    <?php } ?>
    <?php if (isset($mensagemSucessoCupom)) { ?>
        <div class="alert alert-success mb-5" role="alert">
            <?php echo $mensagemSucessoCupom; ?>
        </div>
    <?php } ?>
    <form action="">
        <table class="cart_table">
            <tbody>
                <tr>
                    <td colspan="12" class="actions">
                        <div class="vs-cart-coupon" style="width: 100%;">
                            <input type="text" name="cupom" class="form-control" placeholder="Entrar com o código do cupom...">
                            <button type="submit" class="vs-btn">Aplicar Cupom de Desconto</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
    <div class="row justify-content-end mt-5">
        <div class="col-md-8 col-lg-7 col-xl-6">
            <h2 class="h4 summary-title">Total</h2>
            <table class="cart_totals">
                <tbody>
                    <tr>
                        <td>Sub Total</td>
                        <td data-title="Cart Subtotal">
                            <span class="amount"><bdi><span>R$</span> <?php if (isset($carrinho->preco_total)) {
                                                                            echo $carrinho->preco_total;
                                                                        } ?></bdi></span>
                        </td>
                    </tr>
                    <tr class="shipping">
                        <th>Desconto</th>
                        <?php
                        if (isset($showDesconto) && isset($descontoCupom)) {
                        ?>
                            <td data-title="Shipping and Handling">
                                <span class="amount"><bdi><?php echo $descontoCupom['porcentagem']; ?></bdi></span>
                                <span class="amount" style="color:red; font-size:13px"><bdi><span>-R$ <?php echo $descontoCupom['valor-desconto']; ?></span></bdi></span>
                                <p class="woocommerce-shipping-destination">
                                    Referente ao cupom: <strong><?php echo $descontoCupom['codigo-cupom']; ?></strong><br /><?php echo $descontoCupom['descricao-cupom']; ?>
                                </p>
                                <a href="<?php echo WWW; ?>dashboard/carrinho-de-compras?excluir_cupom=<?php echo $descontoCupom['codigo-cupom']; ?>">Excluir Cupom</a>
                            </td>
                        <?php } else { ?>
                            <td data-title="Shipping and Handling">
                                <span class="amount"><bdi>Sem desconto</bdi></span>
                                <p class="woocommerce-shipping-destination">
                                    <?php if (isset($mensagemSucessoDesconto)) { ?>
                                <div class="alert alert-success mb-5" role="alert">
                                    <?php echo $mensagemSucessoDesconto; ?>
                                </div>
                            <?php } ?>
                            </p>
                            </td>
                        <?php } ?>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="order-total">
                        <td>Valor Total</td>
                        <td data-title="Total">
                            <strong><span class="amount"><bdi><span>R$</span> <?php if (isset($valorTotal)) {
                                                                                    echo $valorTotal;
                                                                                }; ?></bdi></span></strong>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <div class="wc-proceed-to-checkout mb-30">
                <a href="<?php echo WWW; ?>dashboard/carrinho-de-compras/checkout" class="vs-btn">Continuar Compra</a>
            </div>
        </div>
    </div>
<?php } else { ?>
    <div class="row">
        <div class="col-sm-12 mb-5" style="text-align:center;">
            <h4 style="color:red">O CARRINHO ESTÁ VAZIO, VÁ PARA O DASHBOARD E ESCOLHA UM PACOTE PARA O ALUNO!</h4>
        </div>
    </div>
<?php } ?>