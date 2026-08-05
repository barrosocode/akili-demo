<?php

use \RedBeanPHP\R;

if ($showAlunoPageError == null) { ?>
    <div class="vs-blog blog-single">
        <div class="blog-content">
            <h1 class="blog-inner-title">ALUNO</h1>
            <h4 class="blog-title"><?php if (isset($alunoDados->nome) && isset($alunoDados->sobrenome)) {
                                        echo $alunoDados->nome . ' ' . $alunoDados->sobrenome;
                                    } ?></h4>
            <p class="mt-0"><em style="font-size:18px">(<?php if (isset($alunoDados->login)) {
                                                            echo $alunoDados->login;
                                                        } ?>)</em>
                <a id="botao-display-form-aluno" href="#" style="font-size:13px"><i class="fa fa-pencil"></i> Editar Dados</a>
            </p>
        </div>
        <div id="form-dados-aluno" class="vs-comment-form" style="display:<?php if (isset($showFormEditarAluno) && $showFormEditarAluno == true) {
                                                                                echo 'block';
                                                                            } else {
                                                                                echo 'none';
                                                                            } ?>">
            <div id="respond" class="comment-respond">
                <div class="form-title">
                    <h3 class="blog-inner-title">Editar Dados</h3>
                    <p class="form-text">Edite os dados do aluno aqui</p>
                </div>
                <div id="form-dados-aluno" class="vs-comment-form" style="display:block">
                    <form id="formCadastroAluno" action="" method="post" autocomplete="off" novalidate>
                        <div id="respond" class="comment-respond">
                            <?php if (isset($showAlunoSucesso) && $showAlunoSucesso != false) { ?>
                                <div class="">
                                    <p style="color:green"><?php echo $showAlunoSucesso; ?></p>
                                </div>
                            <?php } ?>
                            <?php if (isset($showAlunoEditError) && $showAlunoEditError != false) { ?>
                                <div class="">
                                    <p style="color:red"><?php echo $showAlunoEditError; ?></p>
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
                                        value="<?php if (isset($alunoDados->login)) {
                                                    echo $alunoDados->login;
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
                                                if (isset($alunoDados->id_serie) && $alunoDados->id_serie == $serieAluno->id) {
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
                                    <input type="text" name="nome" class="form-control" value="<?php if (isset($alunoDados->nome)) {
                                                                                                    echo $alunoDados->nome;
                                                                                                } ?>" placeholder="Nome">
                                </div>
                                <div class="col-md-6 form-group">
                                    <input type="text" name="sobrenome" class="form-control" value="<?php if (isset($alunoDados->sobrenome)) {
                                                                                                        echo $alunoDados->sobrenome;
                                                                                                    } ?>" placeholder="Sobrenome">
                                </div>
                                <div class="col-md-6 form-group">
                                    <input type="password" name="senha" class="form-control" placeholder="Senha">
                                </div>
                                <div class="col-md-6 form-group">
                                    <input type="password" name="rsenha" class="form-control" placeholder="Repetir Senha">
                                </div>
                                <div class="col-12 form-group mb-0">
                                    <button class="vs-btn">Editar</button>
                                    <input type="hidden" name="editar-aluno" value="1">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="blog-content mt-5">
            <div class="widget widget_categories   ">
                <h3 class="widget_title">Pacotes Disponíveis para <?php if (isset($alunoDados->nome)) {
                                                                        echo $alunoDados->nome;
                                                                    } ?></h3>
                <?php if (isset($showPacotes)) {
                    echo $showPacotes;
                }
                ?>
            </div>
        </div>

        <div class="share-links clearfix  ">
            <div class="row justify-content-between">
                <?php if (isset($showAlunos)) {
                    echo $showAlunos;
                } ?>
            </div>
        </div>

    </div>
<?php } else { ?>
    <div class="vs-blog blog-single">
        <h3 style="color:red"><?php echo $showAlunoPageError; ?></h3>
    </div>
<?php } ?>