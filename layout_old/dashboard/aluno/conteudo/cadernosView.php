<div class="vs-blog blog-single">
    <div class="blog-content">
        <h1 class="blog-inner-title">Cadernos</h1>
        <?php if (isset($showCaderno) && $showCaderno != null) { ?>
            <h3 class="widget_title"><?php echo $showCaderno['titulo']; ?></h3>
            <p>Código: <strong><?php echo $showCaderno['codigo']; ?></strong></p>
            <p>Tipo: <strong><?php echo $showCaderno['tipo']; ?></strong></p>
            <?php if (isset($showCaderno['disciplina'])) { ?>
                <p>Disciplina: <strong><?php echo $showCaderno['disciplina']; ?></strong></p>
            <?php } ?>
            <?php if (isset($showCaderno['assunto'])) { ?>
                <p>Assunto: <strong><?php echo $showCaderno['assunto']; ?></strong></p>
            <?php } ?>
            <?php if (isset($showCaderno['conteudo'])) { ?>
                <p>Conteúdo: <strong><?php echo $showCaderno['conteudo']; ?></strong></p>
            <?php } ?>
            <p>Total de questões: <strong><?php echo $showCaderno['questoes']; ?></strong></p>
            <p>Criado em: <strong><?php echo $showCaderno['criado']; ?></strong></p>
            <?php echo $showCaderno['descricao']; ?>
            <div class="col-sm-12 text-center">
                <a href="<?php echo WWW; ?>dashboard/verificacao-aprendizado/<?php echo $showCaderno['slug']; ?>" target="_blank" class="vs-btn"><?php echo $showCaderno['titulo_botao']; ?></a>
                <p style="margin-top:40px">
                    <a href="<?php echo WWW; ?>dashboard/cadernos" class=""><i class="fa fa-arrow-left"></i> VOLTAR AOS CADERNOS</a>
                </p>
            </div>
        <?php } else if (isset($showCadernos)) { ?>
            <div class="accordion accordion-style1" id="faqVersion1">
                <?php echo $showCadernos; ?>
            </div>
        <?php
        } else {
            echo 'Não existe Cadernos';
        } ?>
    </div>
</div>