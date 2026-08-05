<?php if (isset($mensagemSucessoCarrinhoFinalizado) && $mensagemSucessoCarrinhoFinalizado == true) { ?>
    <section class="vs-error-wrapper space-top space-extra-bottom" data-bg-src="assets/img/bg/error-bg.png">
        <div class="container">
            <div class="row gx-100 text-center text-lg-start">
                <div class="col-lg-5 col-xl-auto">
                    <img src="assets/img/shape/error-shape.svg" alt="shape">
                </div>
                <div class="col-lg-7 col-xl">
                    <div class="error-content">
                        <h1 class="error-number">Parabéns!</h1>
                        <h2 class="error-title">Pacotes adquiridos com sucesso! </h2>
                        <p style="font-size:20px">Agora seus alunos podem acessar os conteúdos, para isto, basta pedirem a eles para se logar acessando o link <a href="<?php echo WWW;?>logout" target="_blank">https://akilieduc.com.br/login</a> e entrar com o usuário e senha</p>
                        <a href="<?php echo WWW;?>dashboard" class="vs-btn style4">Voltar para o Dashboard</a>
                </div>
            </div>
        </div>
    <?php } else { ?>
        <!--==============================
    Checkout Arae
==============================-->
        <div class="vs-checkout-wrapper">
            <div class="container">
                <form action="" class="woocommerce-checkout mt-40" method="POST">
                    <div class="row ">
                        <div class="col-lg-12">
                            <h2 class="h4">Dados para a Compra</h2>
                            <?php if (isset($mensagemErroAtualizarDados)) { ?>
                                <div class="alert alert-danger mb-5" role="alert">
                                    <?php echo $mensagemErroAtualizarDados; ?>
                                </div>
                            <?php } ?>
                            <?php if (isset($mensagemSucessoAtualizarDados)) { ?>
                                <div class="alert alert-success mb-5" role="alert">
                                    <?php echo $mensagemSucessoAtualizarDados; ?>
                                </div>
                            <?php } ?>
                            <div class="row">
                                <div class="col-md-6 form-group">
                                    <input id="nome" type="text" name="nome" value="<?php if (isset($_SESSION['logado']['responsavel']['nome'])) {
                                                                                        echo $_SESSION['logado']['responsavel']['nome'];
                                                                                    } ?>" class="form-control" placeholder="Nome">
                                </div>
                                <div id="sobrenome" class="col-md-6 form-group">
                                    <input type="text" name="" value="<?php if (isset($_SESSION['logado']['responsavel']['sobrenome'])) {
                                                                            echo $_SESSION['logado']['responsavel']['sobrenome'];
                                                                        } ?>" class="form-control" placeholder="Sobrenome">
                                </div>
                                <div id="cep" class="col-md-2 form-group">
                                    <input type="text" name="cep" value="<?php if ($dadosResponsavel->endereco_cep) {
                                                                                echo $dadosResponsavel->endereco_cep;
                                                                            } else if (isset($dataPost['cep']) && !empty($dataPost['cep'])) {
                                                                                echo $dataPost['cep'];
                                                                            } ?>" class="form-control" placeholder="CEP">
                                </div>
                                <div id="logradouro" class="col-6 form-group">
                                    <input type="text" name="logradouro" class="form-control" value="<?php if ($dadosResponsavel->endereco_logradouro) {
                                                                                                            echo $dadosResponsavel->endereco_logradouro;
                                                                                                        } else if (isset($dataPost['logradouro']) && !empty($dataPost['logradouro'])) {
                                                                                                            echo $dataPost['logradouro'];
                                                                                                        } ?>" placeholder="Endereço">
                                </div>
                                <div id="numero" class="col-md-4 form-group">
                                    <input type="text" name="numero" class="form-control" value="<?php if ($dadosResponsavel->endereco_numero) {
                                                                                                        echo $dadosResponsavel->endereco_numero;
                                                                                                    } else if (isset($dataPost['numero']) && !empty($dataPost['numero'])) {
                                                                                                        echo $dataPost['numero'];
                                                                                                    } ?>" placeholder="Número">
                                </div>
                                <div id="bairro" class="col-6 form-group">
                                    <input type="text" name="bairro" class="form-control" value="<?php if ($dadosResponsavel->endereco_bairro) {
                                                                                                        echo $dadosResponsavel->endereco_bairro;
                                                                                                    } else if (isset($dataPost['bairro']) && !empty($dataPost['bairro'])) {
                                                                                                        echo $dataPost['bairro'];
                                                                                                    } ?>" placeholder="Bairro">
                                </div>
                                <div id="complemento" class="col-6 form-group">
                                    <input type="text" name="complemento" class="form-control" value="<?php if ($dadosResponsavel->endereco_complemento) {
                                                                                                            echo $dadosResponsavel->endereco_complemento;
                                                                                                        } else if (isset($dataPost['complemento']) && !empty($dataPost['complemento'])) {
                                                                                                            echo $dataPost['complemento'];
                                                                                                        } ?>" placeholder="Complemento">
                                </div>
                                <div id="cidade" class="col-10 form-group">
                                    <input type="text" name="cidade" class="form-control" value="<?php if ($dadosResponsavel->endereco_cidade) {
                                                                                                        echo $dadosResponsavel->endereco_cidade;
                                                                                                    } else if (isset($dataPost['cidade']) && !empty($dataPost['cidade'])) {
                                                                                                        echo $dataPost['cidade'];
                                                                                                    } ?>" placeholder="Cidade">
                                </div>
                                <div id="uf" class="col-md-2 form-group">
                                    <input type="text" name="uf" class="form-control" value="<?php if ($dadosResponsavel->endereco_uf) {
                                                                                                    echo $dadosResponsavel->endereco_uf;
                                                                                                } else if (isset($dataPost['uf']) && !empty($dataPost['uf'])) {
                                                                                                    echo $dataPost['uf'];
                                                                                                } ?>" placeholder="UF">
                                </div>
                                <div class="col-12 form-group">
                                    <input type="text" name="email" value="<?php if (isset($_SESSION['logado']['responsavel']['email'])) {
                                                                                echo $_SESSION['logado']['responsavel']['email'];
                                                                            } ?>" class="form-control" placeholder="E-mail">
                                    <input type="text" name="telefone" value="<?php if (isset($_SESSION['logado']['responsavel']['telefone'])) {
                                                                                    echo $_SESSION['logado']['responsavel']['telefone'];
                                                                                } ?>" class="form-control" placeholder="Telefone">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="wc-proceed-to-checkout mb-30">
                        <input type="hidden" name="atualizar-dados" value="1" />
                        <button type="submit" class="vs-btn">Atualizar Dados</button>
                    </div>
                </form>
                <h4 class="mt-4 pt-lg-2">Detalhes da sua compra</h4>
                <?php if ($showDetalhesCarrinho) { ?>
                    <div class="woocommerce-cart-form">
                        <?php echo $showDetalhesCarrinho; ?>
                    </div>
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
                    <div class="row justify-content-end mt-5">
                        <div class="col-md-8 col-lg-7 col-xl-6">
                            <h2 class="h4 summary-title">Total</h2>
                            <table class="cart_totals">
                                <tbody>
                                    <tr>
                                        <td>Sub Total</td>
                                        <td data-title="Cart Subtotal">
                                            <span class="amount"><bdi><span>R$</span> <?php if (isset($carrinho->preco_total)) {
                                                                                            if ($carrinho->preco_total = '0.00') {
                                                                                                echo '0,00';
                                                                                            } else {
                                                                                                echo $carrinho->preco_total;
                                                                                            }
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
                                                                                                    if ($valorTotal == 0) {
                                                                                                        echo $valorTotal . ',00';
                                                                                                    } else {
                                                                                                        echo $valorTotal;
                                                                                                    }
                                                                                                }; ?></bdi></span></strong>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <form action="" class="woocommerce-checkout mt-40" method="POST">
                                <div class="wc-proceed-to-checkout mb-30">
                                    <input type="hidden" name="finalizar-compra" value="1" />
                                    <button type="submit" class="vs-btn">Finalizar Compra</button>
                                </div>
                            </form>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
    <?php } ?>