<div class="widget bg-vs-secondary  " data-bg-src="<?php echo ASSETS_SITE; ?>img/bg/widget-bg-1-1.png">
    <h4 class="mt-n2 text-white"><?php if (isset($_SESSION['logado']['aluno']['nome'])) {
                                                                    echo $_SESSION['logado']['aluno']['nome'].' '.$_SESSION['logado']['aluno']['sobrenome'];
                                                                } ?></h4>
    <p class="mb-4 pb-1 text-white">
        <strong>Login:</strong> <?php echo $_SESSION['logado']['aluno']['login'];?><br />
        <strong>Série:</strong> <?php echo $_SESSION['logado']['aluno']['serie_titulo'];?><br />
        <strong>Último Acesso:</strong> <?php echo $_SESSION['logado']['aluno']['ultimo_acesso'];?><br />
    </p>
</div>