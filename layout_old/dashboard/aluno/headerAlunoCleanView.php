<!--==============================
        Header Area Clean
    ==============================-->
<header class="vs-header header-layout4">
    <div class="header-top4">
    </div>
    <div class="sticky-wrap">
        <div class="sticky-active">
            <div class="container-style4">
                <div class="header-lower4">
                    <div class="row gx-3 align-items-center justify-content-between">
                        <div class="col-8 col-sm-auto">
                            <div class="header-logo2">
                                <a href="<?php echo WWW; ?>dashboard">
                                    <img src="<?php echo ASSETS_SITE; ?>images/logo-akili-positivo.png" alt="Logo Akili" titke="Logo Akili">
                                </a>
                            </div>
                        </div>
                        <div class="col">
                            <div class="row">
                                <div class="col-sm-6">
                                    <span style="font-size:15px">Bem vindo(a), 
                                            <?php if (isset($_SESSION['logado']['responsavel']['nome'])) {
                                                echo '<strong>'.$_SESSION['logado']['responsavel']['nome'].'</strong>';
                                            }; ?>
                                            <?php if (isset($_SESSION['logado']['aluno']['nome'])) {
                                                echo '<strong>'.$_SESSION['logado']['aluno']['nome'] . ' ' . $_SESSION['logado']['aluno']['sobrenome'].'</strong>';
                                            }; ?>
                                        </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-auto  d-none d-lg-block">
                            <div class="header-icons4">
                                <a href="<?php echo WWW; ?>logout" title="" class="simple-icon cart" style="margin-left:20px"><i class="fas fa-sign-out-alt"></i> Sair</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>