<!--==============================
 Dashboard Responsavel
==============================-->
<?php if (isset($subsessao) && $subsessao == 'carrinho-de-compras') { ?>
    <section class="vs-blog-wrapper blog-details space-top space-extra-bottom">
        <div class="container">
            <div class="row gx-40">
                <?php include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'responsavel' . DS . 'conteudo' . DS . 'conteudo-checkoutView.php';; ?>
            </div>
        </div>
    </section>
<?php } else { ?>
    <section class="vs-blog-wrapper blog-details space-top space-extra-bottom">
        <div class="container">
            <div class="row gx-40">
                <div class="col-lg-4">
                    <aside class="sidebar-area">
                        <?php
                        include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'responsavel' . DS . 'menu' . DS . 'alunosView.php';
                        include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'responsavel' . DS . 'menu' . DS . 'relatoriosView.php';
                        include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'responsavel' . DS . 'menu' . DS . 'videoView.php';
                        //include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'responsavel' . DS . 'menu' . DS . 'searchView.php';
                        //include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'responsavel' . DS . 'menu' . DS . 'conteudo-realizadoView.php';
                        ?>
                    </aside>
                </div>
                <?php include '..' . DS . 'app' . DS . 'views' . DS . 'dashboard' . DS . 'responsavel' . DS . 'conteudo' . DS . 'conteudo-dashboardView.php';; ?>
            </div>
        </div>
    </section>
<?php } ?>