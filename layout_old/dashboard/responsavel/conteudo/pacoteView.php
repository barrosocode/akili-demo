<?php if ($showPacotePageError == null) { ?>
    <div class="vs-blog blog-single">
        <div class="blog-content">

            <?php if (isset($mensagemSucessoPacote)) { ?>
                <div class="alert alert-success mb-5" role="alert">
                    <?php echo $mensagemSucessoPacote; ?>
                </div>
            <?php } ?>

            <?php if (isset($mensagemErroPacote)) { ?>
                <div class="alert alert-danger mb-5" role="alert">
                    <?php echo $mensagemErroPacote; ?>
                </div>
            <?php } ?>

            <h1 class="blog-inner-title">PACOTE PARA O ALUNO <strong style="color:green"><?php echo strtoupper($aluno->nome); ?></strong></h1>
            <?php if (isset($pacote->titulo)) { ?>
                <h2><?php echo $pacote->titulo; ?></h2>
            <?php } ?>
        </div>
        <div class="blog-content mt-5">
            <div class="widget widget_categories   ">
                <h3 class="widget_title">Disciplinas que compõe o pacote</h3>
                <p><em>Clique o nome da disciplina para ver mais detalhes!</em></p>
                <?php if (isset($showDisciplinasPacotes)) {
                    echo $showDisciplinasPacotes;
                }
                ?>
            </div>
        </div>
        <div class="col-12 form-group mb-0">
            <form action="<?php if (isset($urlActionPacote)) {
                                echo $urlActionPacote;
                            } ?>" method="POST">
                <button class="vs-btn"><?php if (isset($acaoPacoteTexto)) {
                                            echo $acaoPacoteTexto;
                                        } ?></button>
                <a href="<?php echo WWW;?>dashboard/carrinho-de-compras" class="vs-btn" style="margin-left:50px; background-color:#ffd600; color:#000"><i class="fa fa-shopping-cart"></i> VER CARRINHO</a>
            </form>
        </div>
        
    </div>
<?php } else { ?>
    <div class="vs-blog blog-single">
        <h3 style="color:red"><?php echo $showPacotePageError; ?></h3>
    </div>
<?php } ?>