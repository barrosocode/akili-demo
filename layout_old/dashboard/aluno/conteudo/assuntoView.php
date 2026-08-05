<div class="vs-blog blog-single">
    <div class="blog-content">
        <?php if(isset($showLinkDisciplina)){ echo $showLinkDisciplina; }?>
        <h1 class="blog-inner-title"><?php if (isset($assunto->assunto)) {
                                            echo $assunto->assunto;
                                        } ?></h1>
        <?php if(isset($assunto->descricao)){ echo $assunto->descricao; }?>
        <div class="widget widget_categories">
            <h3 class="widget_title">Conteúdos</h3>
            <?php if (isset($showConteudos)) {
                echo '<ul>' . $showConteudos . '</ul>';
            } else {
                echo 'Não existe Conteúdos';
            } ?>
        </div>
    </div>
</div>