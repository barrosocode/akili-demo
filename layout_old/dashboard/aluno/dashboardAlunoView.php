<!--==============================
 Dashboard Aluno
==============================-->
<section class="vs-blog-wrapper blog-details space-top space-extra-bottom">
    <div class="container">
        <div class="row gx-40">
            <?php if (isset($showPageConteudo) && $showPageConteudo == 'verificacao-aprendizado' || 
                            $showPageConteudo == 'conteudo'
            )  
            { ?>
                <!-- Sem Menu -->
            <?php } else { ?>
                <div class="col-lg-4">
                    <aside class="sidebar-area">
                        <?php
                        //include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'aluno' . DS . 'menu' . DS . 'videoView.php';
                        include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'aluno' . DS . 'menu' . DS . 'alunoView.php';
                        if(isset($subsessao) && $subsessao == 'assunto'){
                            include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'aluno' . DS . 'menu' . DS . 'conquistasView.php';
                        }
                        include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'aluno' . DS . 'menu' . DS . 'disciplinasView.php';
                        include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'aluno' . DS . 'menu' . DS . 'conteudosRecentesView.php';
                        include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'aluno' . DS . 'menu' . DS . 'cadernosView.php';
                        //include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'aluno' . DS . 'menu' . DS . 'conteudo-realizadoView.php';
                        ?>
                    </aside>
                </div>
            <?php } ?>
            <?php include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'aluno' . DS . 'conteudo' . DS . 'conteudo-dashboardView.php';; ?>
        </div>
    </div>
</section>