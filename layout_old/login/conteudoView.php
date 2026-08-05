<?php //include '..' . DS . 'app' . DS . 'views' . DS . 'shared' . DS . 'breadcrumbView.php'; ?>
<!--==============================
    Contact Area
    ==============================-->
<section class=" space-top " data-bg-src="<?php echo ASSETS_SITE; ?>img/bg/bg-con-1-1.png">
    <div class="container">
        <div class="row">
            <div class="col-xl-auto col-xxl-6">
                <div class="img-box6">
                    <div class="img-1 mega-hover"><img src="<?php echo ASSETS_SITE; ?>images/dashboard/menino-01.png" alt="Menino Computador"></div>
                    <div class="img-2 mega-hover"><img src="<?php echo ASSETS_SITE; ?>images/dashboard/menina-01.png" alt="Menina Computador"></div>
                </div>
            </div>
            <div class="col-xl col-xxl-6 align-self-center">
                <h2 class="sec-title mb-3">Login</h2>
                <?php if (isset($mensageSuccess)) { ?>
                    <div class="row">
                        <div class="col-sm-12">
                            <p style="color: green"><strong><?php echo $mensageSuccess; ?></strong></p>
                        </div>
                    </div>
                <?php } ?>

                <?php if (isset($mensageError)) { ?>
                    <div class="row">
                        <div class="col-sm-12">
                            <p style="color: red"><strong><?php echo $mensageError; ?></strong></p>
                        </div>
                    </div>
                <?php } ?>


                <form action="<?php echo WWW; ?>login" method="POST" class="form-style3">
                    <div class="row justify-content-between">
                        <div class="col-md-6 form-group">
                            <label>E-mail ou Usuário<span class="required"></span></label>
                            <input type="text" name="email" value="<?php if (isset($postData['email'])) {
                                                                        echo $postData['email'];
                                                                    } ?>">
                        </div>
                        <div class="col-md-6 form-group">
                            <label>Senha</label>
                            <input type="password" name="password">
                        </div>


                        <div class="col-auto align-self-center form-group">
                            <label for="notice"><a href="<?php echo WWW;?>recuperar-senha">Esqueceu a Senha?</a></label>
                            <label for="notice"><a href="<?php echo WWW;?>cadastro">Não é cadastrado?</a></label>
                        </div>

                        <div class="col-auto form-group">
                            <button class="vs-btn" type="submit">Entrar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const telefoneInput = document.querySelector("#telefone");

        telefoneInput.addEventListener("input", function(event) {
            let value = telefoneInput.value.replace(/\D/g, ""); // Remove tudo que não for número

            if (value.length > 11) {
                value = value.slice(0, 11); // Limita a 11 dígitos
            }

            if (value.length > 10) {
                telefoneInput.value = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7)}`;
            } else if (value.length > 6) {
                telefoneInput.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
            } else if (value.length > 2) {
                telefoneInput.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 0) {
                telefoneInput.value = `(${value}`;
            }
        });
    });
</script>