<div class="vs-blog blog-single">
    <div class="blog-content">
        <?php if (isset($showLinkDisciplina)) {
            echo $showLinkDisciplina;
        } ?>
        <?php if (isset($showLinkAssunto)) {
            echo $showLinkAssunto;
        } ?>
        <h1 class="blog-inner-title mt-5"><?php if (isset($conteudo->titulo)) {
                                                echo $conteudo->titulo;
                                            } ?></h1>
        <?php if (isset($conteudo->conteudo)) {
            echo str_replace('../../../', WWW, $conteudo->conteudo);
        } ?>

        <div class="row mt-5 mb-5">
            <div class="col-sm-12 text-center">
                <a href="<?php echo WWW; ?>dashboard/verificacao-aprendizado/<?php echo $conteudo->slug; ?>" class="vs-btn"><i class="fa fa-pencil"></i> VERIFICAÇÃO DE APRENDIZADO</a>
            </div>
        </div>

        <div class="row mt-5">
            <?php if (isset($showLinkConteudoAnterior)) { ?>
                <div class="col-sm-4 text-center">
                    <a href="<?php echo $showLinkConteudoAnterior; ?>" class="vs-btn"><i class="fa fa-arrow-left"></i> Voltar</a>
                </div>
            <?php } ?>
            <?php if (isset($showListaAssuntos)) { ?>
                <div class="col-sm-4 text-center">
                    <a href="<?php echo $showListaAssuntos; ?>" class="vs-btn"><i class="fa fa-list"></i> Listar Assuntos</a>
                </div>
            <?php } ?>
            <?php if ($showLinkConteudoProximo) { ?>
                <div class="col-sm-4 text-center">
                    <a href="<?php echo $showLinkConteudoProximo; ?>" class="vs-btn">Próximo assunto <i class="fa fa-arrow-right"></i></a>
                </div>
            <?php } ?>
        </div>
    </div>
</div>