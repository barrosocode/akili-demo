<?php

use \RedBeanPHP\R;
?>
<div class="vs-blog blog-single">
    <!-- <div class="blog-img">
            <img src="<?php echo ASSETS_SITE; ?>img/blog/blog-single-1-1.jpg" alt="Blog Image">
        </div> -->
    <div class="blog-content">
        <h2 class="blog-title">RESPONSÁVEL PELO ALUNO</h2>
        <h3>Meus Alunos</h3>
        <p>Visualize e gerencie os alunos cadastrados sob sua responsabilidade.</p>
        <div class="share-links clearfix  ">
            <div class="row justify-content-between">
                <?php if (isset($showAlunos)) {
                    echo $showAlunos;
                } ?>
            </div>
        </div>

        <?php if (isset($showAlunoSucesso) && $showAlunoSucesso != false) { ?>
            <div class="">
                <p style="color:green"><?php echo $showAlunoSucesso; ?></p>
            </div>
        <?php } ?>
        
        <?php if (isset($showFormCadatrarAluno) && $showFormCadatrarAluno == false) {?>
        <button id="cadastrar-aluno" class="vs-btn"><i class="fa fa-plus"></i> Adicionar Novo Aluno</button>
        <?php }?>

        <div id="form-dados-aluno" class="vs-comment-form" style="display:<?php if (isset($showFormCadatrarAluno) && $showFormCadatrarAluno == true) {
                                                                                echo 'block';
                                                                            } else {
                                                                                echo 'none';
                                                                            } ?>">
            <form id="formCadastroAluno" action="" method="post" autocomplete="off" novalidate>
                <div id="respond" class="comment-respond">
                    <div class="form-title">
                        <h3 class="blog-inner-title">Adicionar novo aluno</h3>
                    </div>
                    <?php if (isset($showAlunoPageError) && $showAlunoPageError != false) { ?>
                        <div class="">
                            <p style="color:red"><?php echo $showAlunoPageError; ?></p>
                        </div>
                    <?php } ?>
                    <div class="row gx-20">
                        <!-- dica/ajuda -->
                        <label id="loginHelp" style="font-size:11px; color:#666; margin-left:10px; display:block">
                            Use apenas letras, números, <code>-</code> e <code>_</code>. Sem acentos nem espaços. Ex.: <b>maria-eduarda</b> ou <b>JOAO_123</b>
                        </label>
                        <div class="col-md-12 form-group">
                            <input type="text" autocomplete="off"
                                readonly
                                onfocus="this.removeAttribute('readonly');"
                                name="loginaluno"
                                class="form-control"
                                pattern="^[A-Za-z0-9_-]+$"
                                aria-describedby="loginHelp loginError"
                                value="<?php if (isset($postAlunoData['loginaluno'])) {
                                            echo $postAlunoData['loginaluno'];
                                        } ?>"
                                placeholder="Login">
                        </div>
                        <!-- erro -->
                        <small id="loginError" style="font-size:11px; color:red; margin-left:10px; display:none">
                            Login inválido. Permitidos: letras (A–Z ou a–z), números (0–9), hífen (-) e underscore (_). Sem acentos, espaços ou outros caracteres.
                        </small>

                        <div class="col-md-12 form-group">
                            <select name="serie_aluno">
                                <option value="">Selecione a Série (Obrigatório)</option>
                                <?php
                                //Series
                                $seriesAluno = R::findAll($table['series'], 'deleted_at IS NULL ORDER BY serie ASC');
                                $showAlunoSeries = '';
                                if ($seriesAluno != null) {
                                    foreach ($seriesAluno as $serieAluno) {
                                        if (isset($postAlunoData['serie_aluno']) && $postAlunoData['serie_aluno'] == $serieAluno->id) {
                                            echo '<option value="' . $serieAluno->id . '" selected>' . $serieAluno->serie . '</option>';
                                        } else {
                                            echo '<option value="' . $serieAluno->id . '">' . $serieAluno->serie . '</option>';
                                        }
                                    }
                                }
                                ?>
                            </select>
                        </div>
                        <div class="col-md-6 form-group">
                            <input type="text" name="nome" class="form-control" value="<?php if (isset($postAlunoData['nome'])) {
                                                                                            echo $postAlunoData['nome'];
                                                                                        } ?>" placeholder="Nome">
                        </div>
                        <div class="col-md-6 form-group">
                            <input type="text" name="sobrenome" class="form-control" value="<?php if (isset($postAlunoData['sobrenome'])) {
                                                                                                echo $postAlunoData['sobrenome'];
                                                                                            } ?>" placeholder="Sobrenome">
                        </div>
                        <div class="col-md-6 form-group">
                            <input type="password" name="senha" class="form-control" placeholder="Senha">
                        </div>
                        <div class="col-md-6 form-group">
                            <input type="password" name="rsenha" class="form-control" placeholder="Repetir Senha">
                        </div>
                        <div class="col-12 form-group mb-0">
                            <button class="vs-btn">Adicionar</button>
                            <input type="hidden" name="adicionar-aluno" value="1">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="blog-author  ">
        <div class="media-img">
            <img src="<?php echo ASSETS_SITE; ?>images/dashboard/sobre.png" alt="Sobre a Plataforma" title="Sobre a Plataforma">
        </div>
        <div class="media-body">
            <p class="author-degi">Por Cammila</p>
            <h3 class="author-name h4">
                Sobre a Plataforma
            </h3>
            <p class="author-text">A Akili Educ foi desenvolvida para tornar o aprendizado mais interativo e acessível.
                Aqui você pode acompanhar o progresso dos seus filhos, acessar materiais personalizados e incentivar o
                desenvolvimento educacional com atividades dinâmicas.
            </p>
        </div>
    </div>

</div>