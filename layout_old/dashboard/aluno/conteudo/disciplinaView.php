<div class="vs-blog blog-single">
    <div class="blog-content">
        <h1 class="blog-inner-title"><?php if (isset($disciplina->disciplina)) {
                                            echo $disciplina->disciplina;
                                        } ?></h1>
        <div class="widget widget_categories   ">
            <h3 class="widget_title">Assuntos</h3>
            <?php if (isset($showAssuntos)) {
                echo '<ul>' . $showAssuntos . '</ul>';
            } else {
                echo 'Não existe Assuntos';
            } ?>
        </div>
    </div>
</div>