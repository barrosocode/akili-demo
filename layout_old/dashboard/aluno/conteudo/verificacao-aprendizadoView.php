<?php $showButtonFinalizarTentativaRodape = true; ?>
<div class="vs-blog blog-single">
    <div class="blog-content">
        <?php if (isset($showTituloTopoCaderno)) { ?>
            <div class="" style="text-align:center; width:100%; font-size:20px">
                <p><?php echo $showTituloTopoCaderno['tipo']; ?></p>
                <p class="" style="font-size:30px; margin-top:-25px"><strong><?php echo $showTituloTopoCaderno['titulo']; ?></strong></p>
            </div>
        <?php }
        ?>
        <?php
        if (isset($showLinkDisciplina)) {
            echo $showLinkDisciplina;
        } ?>
        <?php if (isset($showLinkAssunto)) {
            echo $showLinkAssunto;
        } ?>
        <h1 class="blog-inner-title mt-5"><?php if (isset($conteudo->titulo)) {
                                                echo $conteudo->titulo;
                                            } ?></h1>

        <?php if (isset($showQuestoes) && $showQuestoes == true) { ?>
            <div class="container">
                <div class="row gx-80">
                    <div class="col-lg-12 align-self-center">
                        <div class="accordion accordion-style1" id="faqVersion1">
                            <div class="accordion-item active">
                                <div class="accordion-header" id="headingOne1">
                                    <button class="accordion-button" type="button" aria-controls="collapseOne1">
                                        <?php if (isset($perguntaAtual->pergunta)) {
                                            echo $perguntaAtual->pergunta;
                                        } ?>
                                    </button>
                                </div>
                                <div class="accordion-collapse collapse show">
                                    <div class="accordion-body">
                                        <?php if (isset($showResultadoTentativa)) {
                                            $showButtonFinalizarTentativa = false;
                                            $showButtonFinalizarTentativaRodape = false;
                                            $linkAnteriorPergunta = false;
                                            $linkProximaPergunta = false;
                                        ?>
                                            <h3>Resultado tentativa: <strong><?php echo $tentativa->tentativa; ?></strong></h3>
                                            <h6>Total de Questões: <?php if (isset($tentativa->total_perguntas)) {
                                                                        echo $tentativa->total_perguntas;
                                                                    } ?>
                                            </h6>
                                            <h6>Total Respondidos: <?php if (isset($tentativa->total_respondidos)) {
                                                                        echo $tentativa->total_respondidos;
                                                                    } ?>
                                            </h6>
                                            <h6>Total Acertos: <?php if (isset($tentativa->total_acertos)) {
                                                                    echo $tentativa->total_acertos;
                                                                } ?>
                                            </h6>
                                            <h6>Total Erros: <?php if (isset($tentativa->total_erros)) {
                                                                    echo $tentativa->total_erros;
                                                                } ?>
                                            </h6>
                                            <h6>Porcentagem Acertos: <?php if (isset($tentativa->porcentagem_acertos)) {
                                                                            echo $tentativa->porcentagem_acertos . '%';
                                                                        } ?>
                                            </h6>
                                            <h6>Status Gamificação: <?php if (isset($tentativa->gameficacao)) {
                                                                        echo '<img src="' . ASSETS_SITE . 'images/icones/' . $listaGamificacao[$tentativa->gameficacao] . '.png" title="' . $tentativa->porcentagem_acertos . '%' . '" alt="' . $tentativa->porcentagem_acertos . '%' . '" class="" style="margin-left:5px"> ' . $listaGamificacaoTexto[$tentativa->gameficacao];
                                                                    } ?>
                                            </h6>
                                        <?php } else { ?>
                                            <form id="form-resposta" action="" method="POST">
                                                <?php
                                                if (isset($perguntaAtual->alternativas) != null) {
                                                    $showAlternativas = json_decode($perguntaAtual->alternativas, true);
                                                    // var_dump($showAlternativas);
                                                    // exit;
                                                ?>
                                                    <div class="widget_perguntas">
                                                        <?php
                                                        $letras = ['A', 'B', 'C', 'D', 'E'];
                                                        $iletra = 0;
                                                        // Converte para array simples preservando número
                                                        $alternativasRandom = [];

                                                        foreach ($showAlternativas['alternativas'] as $chave => $texto) {
                                                            $numero = str_replace('alternativa_', '', $chave);
                                                            $alternativasRandom[] = [
                                                                'numero' => $numero,
                                                                'texto'  => $texto
                                                            ];
                                                        }

                                                        // Embaralha a ordem
                                                        shuffle($alternativasRandom);

                                                        foreach ($alternativasRandom as $alt) {

                                                            $numero = $alt['numero'];
                                                            $alternativa = $alt['texto'];

                                                            if ($respostaAtual != null) {
                                                                $minhaResposta = $respostaAtual->resposta;
                                                            }

                                                            $checked = (isset($minhaResposta) && $numero == $minhaResposta) ? 'checked' : '';
                                                        ?>
                                                            <input
                                                                type="radio"
                                                                id="alt_<?php echo $numero; ?>"
                                                                value="<?php echo $numero; ?>"
                                                                name="alternativa"
                                                                <?php echo $checked; ?>>

                                                            <label
                                                                for="alt_<?php echo $numero; ?>"
                                                                data-letter="<?php echo $letras[$iletra]; ?>">
                                                                <?php echo $alternativa; ?>
                                                            </label>

                                                            <?php
                                                            // Exibição da resposta (mantida correta)
                                                            if (isset($showRespostas) && $showRespostas == true) {

                                                                $alternativaCorreta = $showAlternativas['alternativa_correta'];

                                                                if ($numero == $minhaResposta) {

                                                                    if ($alternativaCorreta == $minhaResposta) {
                                                                        $showResposta =
                                                                            '<p style="font-size:16px; margin-left:30px" class="mb-3">
                        <em style="font-weight:bold; color:green">
                            PARABÉNS ALTERNATIVA CORRETA!
                        </em> ' .
                                                                            $showAlternativas['respostas']['resposta_' . $minhaResposta] .
                                                                            '</p>';
                                                                    } else {
                                                                        $showResposta =
                                                                            '<p style="font-size:16px; margin-left:30px" class="mb-3">
                        <em style="font-weight:bold; color:red">
                            ALTERNATIVA ERRADA!
                        </em> ' .
                                                                            $showAlternativas['respostas']['resposta_' . $minhaResposta] .
                                                                            '</p>';
                                                                    }
                                                            ?>
                                                                    <div class="row">
                                                                        <div class="col-sm-12">
                                                                            <?php echo $showResposta; ?>
                                                                        </div>
                                                                    </div>
                                                        <?php
                                                                }
                                                            }

                                                            $iletra++;
                                                        } ?>
                                                    </div>
                                                <?php } ?>

                                                <?php if (isset($showButtonFinalizarTentativa)) { ?>
                                                    <div id="verificarResposta" class="row mt-5 mb-5" style="display: block;">
                                                        <div class="col-sm-12 text-center">
                                                            <input type="hidden" value="1" name="finalizar-tentativa" />
                                                            <button type="submit" class="vs-btn" name="finalizar"><i class="fa fa-check"></i> FINALIZAR TENTATIVA: <?php if (isset($tentativa->tentativa)) {
                                                                                                                                                                        echo '<strong>' . $tentativa->tentativa . '</strong>';
                                                                                                                                                                    } ?></button>
                                                        </div>
                                                    </div>
                                                <?php } else { ?>
                                                    <div id="verificarResposta" class="row mt-5 mb-5" style="display: none;">
                                                        <div class="col-sm-12 text-center">
                                                            <button type="submit" class="vs-btn" name="resposta" value="responder"><i class="fa fa-check"></i> VERIFICAÇÃO RESPOSTA</button>
                                                        </div>
                                                    </div>
                                                <?php } ?>
                                            </form>
                                        <?php } ?>

                                    </div>

                                </div>
                                <div class="row mt-5">
                                    <div class="col-sm-4 text-center">
                                        <?php if (isset($linkAnteriorPergunta) && $linkAnteriorPergunta != false) { ?>
                                            <a href="<?php echo $linkAnteriorPergunta; ?>" class="vs-btn"><i class="fa fa-arrow-left"></i> Pergunta Anterior</a>
                                        <?php } ?>
                                    </div>
                                    <?php if (isset($showNovaTentativa) && $showNovaTentativa == true) { ?>
                                        <div class="col-sm-4 text-center">
                                            <?php if (isset($linkNovaTentativa)) { ?>
                                                <a href="<?php echo $linkNovaTentativa; ?>" class="vs-btn"><i class="fa fa-file"></i> Fazer nova tentativa</a>
                                            <?php } ?>
                                        </div>
                                    <?php } ?>
                                    <div class="col-sm-4 text-center">
                                        <?php if (isset($linkConteudo) && !isset($caderno)) { ?>
                                            <a href="<?php echo $linkConteudo; ?>" class="vs-btn"><i class="fa fa-file"></i> Voltar ao Contéudo</a>
                                        <?php } ?>
                                    </div>
                                    <div class="col-sm-4 text-center">
                                        <?php if (isset($linkProximaPergunta) && $linkProximaPergunta != false) { ?>
                                            <a href="<?php echo $linkProximaPergunta; ?>" class="vs-btn">Próxima Pergunta <i class="fa fa-arrow-right"></i></a>
                                        <?php } ?>
                                    </div>
                                </div>

                                <?php if (isset($showButtonFinalizarTentativaRodape) && $showButtonFinalizarTentativaRodape != false) {
                                ?>
                                    <div class="row" style="margin-top:80px">
                                        <div class="col-sm-12" style="text-align:right">
                                            <form action="" method="POST">
                                                <input type="hidden" value="1" name="finalizar-tentativa" />
                                                <button type="submit" class="btn btn-sm btn-danger" name="resposta" value="responder"><i class="fa fa-pencil"></i> FINALIZAR TENTATIVA</button>
                                            </form>
                                        </div>
                                    </div>
                                <?php }
                                ?>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        <?php } else { ?>
            <div class="container">
                <div class="row gx-80">
                    <div class="col-lg-12 align-self-center">
                        <h3>Não há questões para este conteúdo!</h3>
                        <?php if (isset($linkConteudo)) { ?>
                            <a href="<?php echo $linkConteudo; ?>" class="vs-btn mt-5"><i class="fa fa-file"></i> Voltar ao Contéudo</a>
                        <?php } ?>
                    </div>
                </div>
            </div>
        <?php } ?>
    </div>
</div>