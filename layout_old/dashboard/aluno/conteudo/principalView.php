<div class="vs-blog blog-single">
    <div class="blog-img">
        <img src="<?php echo ASSETS_SITE; ?>images/dashboard/dashboard.png" alt="Dashboard Aluno" title="Dashboard Aluno">
    </div>
    <div class="blog-content">
        <h2 class="blog-title">Bem-vindo ao seu Dashboard, <?php if (isset($_SESSION['logado']['aluno']['nome'])) {
                                                                echo $_SESSION['logado']['aluno']['nome'];
                                                            } ?></h2>
        <p>Olá! Que bom ver você aqui! Este é o seu <strong>Dashboard</strong>, um lugar especial onde você encontra tudo o que precisa para aprender e se divertir ao mesmo tempo!</p>

        <p>Aqui você pode:</p>
        <div class="row align-items-center">
            <div class="col-xl">
                <div class="list-style1">
                    <ul class="list-unstyled">
                        <li>Ver seus <strong>dados</strong> e acompanhar seu progresso.</li>
                        <li>Acessar suas <strong>disciplinas</strong> e conteúdos de estudo.</li>
                        <li>Fazer <strong>questões</strong> para testar seus conhecimentos.</li>
                        <li>Participar da <strong>gamificação</strong>, ganhando pontos e recompensas!</li>
                    </ul>
                </div>
            </div>
            <div class="col-xl-auto">
                <div class="mb-30 mega-hover"><img src="<?php echo ASSETS_SITE; ?>images/dashboard/features.png" alt="Features" title="Features" class="w-100"></div>
            </div>
        </div>

        <p>Tudo foi criado pensando em você, de um jeito divertido e fácil de usar, principalmente para quem tem TDAH! Aqui, aprender se torna uma grande aventura!</p>

        <p>Agora, que tal explorar o seu painel e começar essa jornada?</p>

        <h3>Ainda está com dúvida? assista o vídeo abaixo com a tutora explicando passo a passo</h3>
        <div class="mega-hover mb-30">
            <img src="<?php echo ASSETS_SITE; ?>images/dashboard/video.png" alt="Vídeo" title="Vídeo">
            <a href="https://www.youtube.com/watch?v=_sI_Ps7JSEk"
                class="play-btn popup-video position-center"><i class="fas fa-play"></i></a>
        </div>
    </div>
</div>