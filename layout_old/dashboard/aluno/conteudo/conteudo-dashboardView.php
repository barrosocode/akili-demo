<?php if (
    isset($showPageConteudo) && $showPageConteudo == 'verificacao-aprendizado' ||
    $showPageConteudo == 'conteudo'
) { ?>
    <div class="col-lg-12">
    <?php } else { ?>
        <div class="col-lg-8">
        <?php }
    if (isset($showPageConteudo)) {
        include $showPageConteudo . 'View.php';
    }
        ?>
        </div>